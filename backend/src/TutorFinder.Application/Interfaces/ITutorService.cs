using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface ITutorService
{
    Task<Result<TutorProfileResponse>> UpsertProfileAsync(Guid userId, TutorProfileRequest request, CancellationToken ct);
    Task<Result<TutorProfileResponse>> GetProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Result<TutorProfileResponse>> GetProfileByIdAsync(Guid tutorId, CancellationToken ct);
    Task<Result<PagedResult<TutorSearchResultDto>>> SearchAsync(TutorSearchRequest request, CancellationToken ct);
}

