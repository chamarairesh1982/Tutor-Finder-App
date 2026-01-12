using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ITutorRepository _tutorRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notificationService;

    public BookingService(
        IBookingRepository bookingRepository,
        ITutorRepository tutorRepository,
        IUserRepository userRepository,
        INotificationService notificationService)
    {
        _bookingRepository = bookingRepository;
        _tutorRepository = tutorRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
    }

    public async Task<Result<BookingResponse>> CreateBookingAsync(Guid studentId, CreateBookingRequest request, CancellationToken ct)
    {
        var tutor = await _tutorRepository.GetByIdAsync(request.TutorId, ct);
        if (tutor == null) return new Result<BookingResponse>.Failure("Tutor not found", 404);

        var hasPending = await _bookingRepository.HasPendingRequestAsync(studentId, tutor.Id, ct);
        if (hasPending) return new Result<BookingResponse>.Failure("You already have a pending request with this tutor", 409);

        var booking = new BookingRequest
        {
            StudentId = studentId,
            TutorId = tutor.Id,
            PreferredMode = request.PreferredMode,
            PreferredDate = request.PreferredDate,
            PricePerHourAtBooking = tutor.PricePerHour,
            Status = BookingStatus.Pending
        };

        if (!string.IsNullOrEmpty(request.InitialMessage))
        {
            booking.Messages.Add(new BookingMessage
            {
                SenderId = studentId,
                Content = request.InitialMessage
            });
        }

        await _bookingRepository.AddAsync(booking, ct);
        await _bookingRepository.SaveChangesAsync(ct);

        await _notificationService.NotifyBookingEventAsync(booking.Id, "created", tutor.UserId, "New booking request", ct);

        var fullBooking = await _bookingRepository.GetByIdAsync(booking.Id, ct);
        return new Result<BookingResponse>.Success(MapToResponse(fullBooking!));
    }

    public async Task<Result<BookingResponse>> RespondToBookingAsync(Guid tutorUserId, Guid bookingId, RespondToBookingRequest request, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return new Result<BookingResponse>.Failure("Booking not found", 404);

        if (booking.Tutor.UserId != tutorUserId) return new Result<BookingResponse>.Failure("Unauthorized", 403);
        if (booking.Status != BookingStatus.Pending) return new Result<BookingResponse>.Failure("Only pending bookings can be updated", 400);
        if (request.NewStatus is not (BookingStatus.Accepted or BookingStatus.Declined)) return new Result<BookingResponse>.Failure("Invalid status transition", 400);

        booking.Status = request.NewStatus;
        booking.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Message))
        {
            await _bookingRepository.AddMessageAsync(new BookingMessage
            {
                BookingRequestId = booking.Id,
                SenderId = tutorUserId,
                Content = request.Message
            }, ct);
        }

        await _bookingRepository.UpdateAsync(booking, ct);
        await _bookingRepository.SaveChangesAsync(ct);

        await _notificationService.NotifyBookingEventAsync(booking.Id, booking.Status.ToString().ToLowerInvariant(), booking.StudentId, "Booking status updated", ct);

        return new Result<BookingResponse>.Success(MapToResponse(booking));
    }

    public async Task<Result<BookingResponse>> CancelBookingAsync(Guid userId, Guid bookingId, CancelBookingRequest request, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return new Result<BookingResponse>.Failure("Booking not found", 404);

        var isParticipant = booking.StudentId == userId || booking.Tutor.UserId == userId;
        if (!isParticipant) return new Result<BookingResponse>.Failure("Unauthorized", 403);

        if (booking.Status is BookingStatus.Declined or BookingStatus.Cancelled or BookingStatus.Completed)
            return new Result<BookingResponse>.Failure("Booking can no longer be cancelled", 400);

        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Message))
        {
            await _bookingRepository.AddMessageAsync(new BookingMessage
            {
                BookingRequestId = booking.Id,
                SenderId = userId,
                Content = request.Message
            }, ct);
        }

        await _bookingRepository.UpdateAsync(booking, ct);
        await _bookingRepository.SaveChangesAsync(ct);

        await _notificationService.NotifyBookingEventAsync(booking.Id, "cancelled", booking.StudentId, "Booking cancelled", ct);

        return new Result<BookingResponse>.Success(MapToResponse(booking));
    }

    public async Task<Result<BookingResponse>> CompleteBookingAsync(Guid tutorUserId, Guid bookingId, CompleteBookingRequest request, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return new Result<BookingResponse>.Failure("Booking not found", 404);

        if (booking.Tutor.UserId != tutorUserId) return new Result<BookingResponse>.Failure("Unauthorized", 403);
        if (booking.Status != BookingStatus.Accepted) return new Result<BookingResponse>.Failure("Only accepted bookings can be completed", 400);

        booking.Status = BookingStatus.Completed;
        booking.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Message))
        {
            await _bookingRepository.AddMessageAsync(new BookingMessage
            {
                BookingRequestId = booking.Id,
                SenderId = tutorUserId,
                Content = request.Message
            }, ct);
        }

        await _bookingRepository.UpdateAsync(booking, ct);
        await _bookingRepository.SaveChangesAsync(ct);

        await _notificationService.NotifyBookingEventAsync(booking.Id, "completed", booking.StudentId, "Booking completed", ct);

        return new Result<BookingResponse>.Success(MapToResponse(booking));
    }

    public async Task<Result<BookingResponse>> GetBookingByIdAsync(Guid userId, Guid bookingId, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return new Result<BookingResponse>.Failure("Booking not found", 404);

        if (booking.StudentId != userId && booking.Tutor.UserId != userId)
            return new Result<BookingResponse>.Failure("Unauthorized", 403);

        return new Result<BookingResponse>.Success(MapToResponse(booking));
    }

    public async Task<Result<List<BookingResponse>>> GetMyBookingsAsync(Guid userId, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null) return new Result<List<BookingResponse>>.Failure("User not found", 404);

        List<BookingRequest> bookings;
        if (user.Role == UserRole.Tutor)
        {
            var profile = await _tutorRepository.GetByUserIdAsync(userId, ct);
            if (profile == null) return new Result<List<BookingResponse>>.Success(new List<BookingResponse>());
            bookings = await _bookingRepository.GetByTutorIdAsync(profile.Id, ct);
        }
        else
        {
            bookings = await _bookingRepository.GetByStudentIdAsync(userId, ct);
        }

        return new Result<List<BookingResponse>>.Success(bookings.Select(MapToResponse).ToList());
    }

    public async Task<Result<BookingMessageDto>> SendMessageAsync(Guid userId, Guid bookingId, SendMessageRequest request, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return new Result<BookingMessageDto>.Failure("Booking not found", 404);

        if (booking.StudentId != userId && booking.Tutor.UserId != userId)
            return new Result<BookingMessageDto>.Failure("Unauthorized", 403);

        var message = new BookingMessage
        {
            BookingRequestId = bookingId,
            SenderId = userId,
            Content = request.Content
        };

        await _bookingRepository.AddMessageAsync(message, ct);
        await _bookingRepository.SaveChangesAsync(ct);

        var sender = await _userRepository.GetByIdAsync(userId, ct);

        return new Result<BookingMessageDto>.Success(new BookingMessageDto(
            message.Id,
            userId,
            sender?.DisplayName ?? "User",
            message.Content,
            message.SentAt
        ));
    }

    private static BookingResponse MapToResponse(BookingRequest b)
    {
        return new BookingResponse(
            b.Id,
            b.StudentId,
            b.Student?.DisplayName ?? "Student",
            b.TutorId,
            b.Tutor?.FullName ?? "Tutor",
            b.PreferredMode,
            b.PreferredDate,
            b.PricePerHourAtBooking,
            b.Status,
            b.CreatedAt,
            b.Review != null,
            b.Messages.Select(m => new BookingMessageDto(
                m.Id,
                m.SenderId,
                m.Sender?.DisplayName ?? "User",
                m.Content,
                m.SentAt
            )).ToList()
        );
    }
}

