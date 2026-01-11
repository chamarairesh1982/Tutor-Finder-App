using Microsoft.EntityFrameworkCore;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Reviews
            .Include(r => r.Student)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
    }

    public async Task<Review?> GetByBookingRequestIdAsync(Guid bookingRequestId, CancellationToken ct)
    {
        return await _context.Reviews
            .Include(r => r.Student)
            .FirstOrDefaultAsync(r => r.BookingRequestId == bookingRequestId, ct);
    }

    public async Task<List<Review>> GetByTutorIdAsync(Guid tutorId, CancellationToken ct)
    {
        return await _context.Reviews
            .Include(r => r.Student)
            .Where(r => r.TutorProfileId == tutorId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Review review, CancellationToken ct)
    {
        await _context.Reviews.AddAsync(review, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
