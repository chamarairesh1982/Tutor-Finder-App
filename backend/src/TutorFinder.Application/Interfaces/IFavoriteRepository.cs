using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Favorite?> GetByUserAndTutorAsync(Guid userId, Guid tutorProfileId, CancellationToken ct);
    Task<List<Favorite>> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task<bool> ExistsAsync(Guid userId, Guid tutorProfileId, CancellationToken ct);
    Task AddAsync(Favorite favorite, CancellationToken ct);
    void Remove(Favorite favorite);
    Task SaveChangesAsync(CancellationToken ct);
}
