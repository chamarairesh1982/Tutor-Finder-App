using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct);
    Task<RefreshToken?> GetActiveByUserAsync(Guid userId, CancellationToken ct);
    Task<List<RefreshToken>> GetByTokenFamilyAsync(string tokenFamily, CancellationToken ct);
    Task AddAsync(RefreshToken refreshToken, CancellationToken ct);
    Task RevokeByFamilyAsync(string tokenFamily, string reason, CancellationToken ct);
    Task RevokeByUserAsync(Guid userId, string reason, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
