using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Interfaces;

public interface ITutorRepository
{
    Task<TutorProfile?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task AddAsync(TutorProfile profile, CancellationToken ct);
    Task UpdateAsync(TutorProfile profile, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
