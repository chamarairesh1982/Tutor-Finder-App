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
            .Include(t => t.User)
            .Include(t => t.Subjects)
            .Include(t => t.AvailabilitySlots)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<TutorProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await _context.TutorProfiles
            .Include(t => t.User)
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
        // Avoid forcing the whole object graph to Modified when it's already tracked.
        if (_context.Entry(profile).State == EntityState.Detached)
        {
            _context.TutorProfiles.Update(profile);
        }

        await Task.CompletedTask;
    }

    public async Task ReplaceSubjectsAsync(Guid tutorProfileId, IReadOnlyCollection<string> subjects, CancellationToken ct)
    {
        await _context.TutorSubjects.Where(s => s.TutorProfileId == tutorProfileId).ExecuteDeleteAsync(ct);

        var entities = subjects.Select(s => new TutorSubject { TutorProfileId = tutorProfileId, SubjectName = s }).ToList();
        await _context.TutorSubjects.AddRangeAsync(entities, ct);
    }

    public async Task ReplaceAvailabilityAsync(Guid tutorProfileId, IReadOnlyCollection<AvailabilitySlot> slots, CancellationToken ct)
    {
        await _context.AvailabilitySlots.Where(a => a.TutorProfileId == tutorProfileId).ExecuteDeleteAsync(ct);

        foreach (var slot in slots)
        {
            slot.TutorProfileId = tutorProfileId;
        }

        await _context.AvailabilitySlots.AddRangeAsync(slots, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
