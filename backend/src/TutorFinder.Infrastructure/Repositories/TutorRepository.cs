using Microsoft.EntityFrameworkCore;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;

public class TutorRepository : ITutorRepository
{
    private readonly AppDbContext _context;

    public TutorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TutorProfile?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.TutorProfiles
            .Include(t => t.Subjects)
            .Include(t => t.AvailabilitySlots)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await _context.TutorProfiles
            .Include(t => t.Subjects)
            .Include(t => t.AvailabilitySlots)
            .FirstOrDefaultAsync(t => t.UserId == userId, ct);
    }

    public async Task AddAsync(TutorProfile profile, CancellationToken ct)
    {
        await _context.TutorProfiles.AddAsync(profile, ct);
    }

    public async Task UpdateAsync(TutorProfile profile, CancellationToken ct)
    {
        _context.TutorProfiles.Update(profile);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
