using Microsoft.EntityFrameworkCore;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly AppDbContext _context;

    public FavoriteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Favorites
            .Include(f => f.TutorProfile)
                .ThenInclude(t => t.Subjects)
            .FirstOrDefaultAsync(f => f.Id == id, ct);
    }

    public async Task<Favorite?> GetByUserAndTutorAsync(Guid userId, Guid tutorProfileId, CancellationToken ct)
    {
        return await _context.Favorites
            .Include(f => f.TutorProfile)
            .FirstOrDefaultAsync(f => f.UserId == userId && f.TutorProfileId == tutorProfileId, ct);
    }

    public async Task<List<Favorite>> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await _context.Favorites
            .Include(f => f.TutorProfile)
                .ThenInclude(t => t.Subjects)
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid tutorProfileId, CancellationToken ct)
    {
        return await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.TutorProfileId == tutorProfileId, ct);
    }

    public async Task AddAsync(Favorite favorite, CancellationToken ct)
    {
        await _context.Favorites.AddAsync(favorite, ct);
    }

    public void Remove(Favorite favorite)
    {
        _context.Favorites.Remove(favorite);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
