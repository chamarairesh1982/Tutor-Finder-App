using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.DTOs;

public record TutorProfileRequest(
    string FullName,
    string Bio,
    Category Category,
    decimal BaseLatitude,
    decimal BaseLongitude,
    string Postcode,
    int TravelRadiusMiles,
    decimal PricePerHour,
    TeachingMode TeachingMode,
    List<string> Subjects,
    List<AvailabilitySlotRequest> Availability
);

public record AvailabilitySlotRequest(
    DayOfWeek DayOfWeek,
    TimeOnly StartTime,
    TimeOnly EndTime
);

public record TutorProfileResponse(
    Guid Id,
    Guid UserId,
    string FullName,
    string? PhotoUrl,
    string Bio,
    Category Category,
    decimal BaseLatitude,
    decimal BaseLongitude,
    string Postcode,
    int TravelRadiusMiles,
    decimal PricePerHour,
    TeachingMode TeachingMode,
    List<string> Subjects,
    decimal AverageRating,
    int ReviewCount,
    bool IsActive
);
