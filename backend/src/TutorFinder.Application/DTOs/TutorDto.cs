using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.DTOs;

public record TutorProfileRequest(
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
    bool HasDbs,
    bool HasCertification,
    List<string> Subjects,
    List<AvailabilitySlotRequest> Availability
);

public record AvailabilitySlotRequest(
    DayOfWeek DayOfWeek,
    string StartTime,
    string EndTime
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
    bool IsActive,
    bool HasDbs,
    bool HasCertification,
    string? NextAvailableText,
    string? ResponseTimeText,
    int ViewCount,
    List<AvailabilitySlotResponse> AvailabilitySlots
);

public record AvailabilitySlotResponse(
    DayOfWeek DayOfWeek,
    string StartTime,
    string EndTime
);

public record TutorStatsResponse(
    int TotalViews,
    int PendingBookings,
    int ActiveBookings,
    int CompletedBookings,
    decimal TotalEarnings,
    double ResponseRate
);

