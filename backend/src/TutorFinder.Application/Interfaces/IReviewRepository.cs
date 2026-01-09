using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Interfaces;

public interface IReviewRepository
{
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<List<Review>> GetByTutorIdAsync(Guid tutorId, CancellationToken ct);
    Task AddAsync(Review review, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
