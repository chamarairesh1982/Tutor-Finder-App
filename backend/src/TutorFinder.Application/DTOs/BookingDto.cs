using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.DTOs;

public record CreateBookingRequest(
    Guid TutorId,
    TeachingMode PreferredMode,
    string? PreferredDate,
    string InitialMessage
);

public record BookingResponse(
    Guid Id,
    Guid StudentId,
    string StudentName,
    Guid TutorId,
    string TutorName,
    TeachingMode PreferredMode,
    string? PreferredDate,
    decimal PricePerHour,
    BookingStatus Status,
    DateTime CreatedAt,
    List<BookingMessageDto> Messages
);

public record BookingMessageDto(
    Guid Id,
    Guid SenderId,
    string SenderName,
    string Content,
    DateTime SentAt
);

public record RespondToBookingRequest(
    BookingStatus NewStatus,
    string? Message
);

public record CancelBookingRequest(
    string? Message
);

public record CompleteBookingRequest(
    string? Message
);

public record SendMessageRequest(
    string Content
);

