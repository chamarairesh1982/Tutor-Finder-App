using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly ITutorRepository _tutorRepository;

    public FavoriteService(
        IFavoriteRepository favoriteRepository,
        ITutorRepository tutorRepository)
    {
        _favoriteRepository = favoriteRepository;
        _tutorRepository = tutorRepository;
    }

    public async Task<Result<FavoriteResponse>> AddFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct)
    {
        // Check if tutor exists
        var tutor = await _tutorRepository.GetByIdAsync(tutorProfileId, ct);
        if (tutor == null)
        {
            return new Result<FavoriteResponse>.Failure("Tutor not found", 404);
        }

        // Check if already favorited
        var existing = await _favoriteRepository.ExistsAsync(userId, tutorProfileId, ct);
        if (existing)
        {
            return new Result<FavoriteResponse>.Failure("Tutor already in favorites", 409);
        }

        // Prevent self-favoriting
        if (tutor.UserId == userId)
        {
            return new Result<FavoriteResponse>.Failure("Cannot favorite your own profile", 400);
        }

        var favorite = new Favorite
        {
            UserId = userId,
            TutorProfileId = tutorProfileId
        };

        await _favoriteRepository.AddAsync(favorite, ct);
        await _favoriteRepository.SaveChangesAsync(ct);

        return new Result<FavoriteResponse>.Success(MapToResponse(favorite, tutor));
    }

    public async Task<Result<bool>> RemoveFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct)
    {
        var favorite = await _favoriteRepository.GetByUserAndTutorAsync(userId, tutorProfileId, ct);
        if (favorite == null)
        {
            return new Result<bool>.Failure("Favorite not found", 404);
        }

        // Ownership check
        if (favorite.UserId != userId)
        {
            return new Result<bool>.Failure("Unauthorized", 403);
        }

        _favoriteRepository.Remove(favorite);
        await _favoriteRepository.SaveChangesAsync(ct);

        return new Result<bool>.Success(true);
    }

    public async Task<Result<List<FavoriteResponse>>> GetMyFavoritesAsync(Guid userId, CancellationToken ct)
    {
        var favorites = await _favoriteRepository.GetByUserIdAsync(userId, ct);
        
        var responses = favorites.Select(f => MapToResponse(f, f.TutorProfile)).ToList();
        
        return new Result<List<FavoriteResponse>>.Success(responses);
    }

    public async Task<Result<bool>> IsFavoriteAsync(Guid userId, Guid tutorProfileId, CancellationToken ct)
    {
        var exists = await _favoriteRepository.ExistsAsync(userId, tutorProfileId, ct);
        return new Result<bool>.Success(exists);
    }

    private static FavoriteResponse MapToResponse(Favorite favorite, TutorProfile tutor)
    {
        return new FavoriteResponse(
            favorite.Id,
            tutor.Id,
            tutor.FullName,
            tutor.PhotoUrl,
            tutor.Category,
            tutor.PricePerHour,
            tutor.AverageRating,
            tutor.ReviewCount,
            tutor.HasDbs,
            tutor.HasCertification,
            favorite.CreatedAt
        );
    }
}
