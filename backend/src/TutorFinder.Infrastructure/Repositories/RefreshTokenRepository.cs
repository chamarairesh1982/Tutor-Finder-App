using Microsoft.EntityFrameworkCore;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct)
    {
        return await _context.Set<RefreshToken>()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == token, ct);
    }

    public async Task<RefreshToken?> GetActiveByUserAsync(Guid userId, CancellationToken ct)
    {
        return await _context.Set<RefreshToken>()
            .FirstOrDefaultAsync(x => x.UserId == userId && x.RevokedAt == null && x.ExpiresAt > DateTime.UtcNow, ct);
    }

    public async Task<List<RefreshToken>> GetByTokenFamilyAsync(string tokenFamily, CancellationToken ct)
    {
        return await _context.Set<RefreshToken>()
            .Where(x => x.TokenFamily == tokenFamily)
            .ToListAsync(ct);
    }

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken ct)
    {
        await _context.Set<RefreshToken>().AddAsync(refreshToken, ct);
    }

    public async Task RevokeByFamilyAsync(string tokenFamily, string reason, CancellationToken ct)
    {
        var tokens = await GetByTokenFamilyAsync(tokenFamily, ct);
        foreach (var token in tokens.Where(x => x.RevokedAt == null))
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = reason;
        }
    }

    public async Task RevokeByUserAsync(Guid userId, string reason, CancellationToken ct)
    {
        var tokens = await _context.Set<RefreshToken>()
            .Where(x => x.UserId == userId && x.RevokedAt == null)
            .ToListAsync(ct);

        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = reason;
        }
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
