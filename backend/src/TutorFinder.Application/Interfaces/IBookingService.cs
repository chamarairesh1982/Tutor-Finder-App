using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IBookingService
{
    Task<Result<BookingResponse>> CreateBookingAsync(Guid studentId, CreateBookingRequest request, CancellationToken ct);
    Task<Result<BookingResponse>> RespondToBookingAsync(Guid tutorUserId, Guid bookingId, RespondToBookingRequest request, CancellationToken ct);
    Task<Result<BookingResponse>> GetBookingByIdAsync(Guid userId, Guid bookingId, CancellationToken ct);
    Task<Result<List<BookingResponse>>> GetMyBookingsAsync(Guid userId, CancellationToken ct);
    Task<Result<BookingMessageDto>> SendMessageAsync(Guid userId, Guid bookingId, SendMessageRequest request, CancellationToken ct);
}
