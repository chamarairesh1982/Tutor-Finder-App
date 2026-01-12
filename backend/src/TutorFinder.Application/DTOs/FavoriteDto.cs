using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.DTOs;

public record FavoriteResponse(
    Guid Id,
    Guid TutorProfileId,
    string TutorName,
    string? TutorPhotoUrl,
    Category TutorCategory,
    decimal TutorPricePerHour,
    decimal TutorAverageRating,
    int TutorReviewCount,
    bool HasDbs,
    bool HasCertification,
    DateTime CreatedAt
);

public record AddFavoriteRequest(
    Guid TutorProfileId
);
