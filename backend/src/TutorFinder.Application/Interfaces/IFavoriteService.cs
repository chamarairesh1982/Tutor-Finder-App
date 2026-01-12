using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IFavoriteService
{
    Task<Result<FavoriteResponse>> AddFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct);
    Task<Result<bool>> RemoveFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct);
    Task<Result<List<FavoriteResponse>>> GetMyFavoritesAsync(Guid userId, CancellationToken ct);
    Task<Result<bool>> IsFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct);
}
