using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Interfaces;

public interface ITutorSearchRepository
{
    Task<PagedResult<TutorSearchResultDto>> SearchAsync(TutorSearchRequest request, CancellationToken ct);
}

public record TutorSearchRequest(

    double? Lat,
    double? Lng,
    string? Postcode,
    int RadiusMiles,
    string? Subject,
    Category? Category,
    decimal? MinRating,
    decimal? PriceMin,
    decimal? PriceMax,
    TeachingMode? Mode,
    int Page,
    int PageSize,
    string SortBy,
    int? AvailabilityDay
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
    TeachingMode TeachingMode,
    bool HasDbs,
    bool HasCertification
);

