using TutorFinder.Domain.Enums;

namespace TutorFinder.IntegrationTests;

public record PagedResult<T>(
    List<T> Items,
    int Total,
    int Page,
    int PageSize
);

public record TutorSearchResultDto(
    Guid Id,
    string FullName,
    string? PhotoUrl,
    Category Category,
    List<string> Subjects,
    decimal PricePerHour,
    decimal AverageRating,
    int ReviewCount,
    double DistanceMiles,
    string NextAvailableText,
    TeachingMode TeachingMode
);

public record CreateBookingRequest(
    Guid TutorId,
    TeachingMode PreferredMode,
    string? PreferredDate,
    string InitialMessage
);

public record BookingMessageDto(
    Guid Id,
    Guid SenderId,
    string SenderName,
    string Content,
    DateTime SentAt
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

public record RespondToBookingRequest(
    BookingStatus NewStatus,
    string? Message
);

public record CompleteBookingRequest(
    string? Message
);
