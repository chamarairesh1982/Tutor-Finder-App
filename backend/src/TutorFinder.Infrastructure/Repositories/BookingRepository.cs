using Microsoft.EntityFrameworkCore;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _context;

    public BookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BookingRequest?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.BookingRequests
            .Include(b => b.Student)
            .Include(b => b.Tutor)
            .Include(b => b.Review)
            .Include(b => b.Messages)
                .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
    }

    public async Task<List<BookingRequest>> GetByStudentIdAsync(Guid studentId, CancellationToken ct)
    {
        return await _context.BookingRequests
            .Include(b => b.Tutor)
            .Include(b => b.Student)
            .Include(b => b.Review)
            .Include(b => b.Messages)!.ThenInclude(m => m.Sender)
            .Where(b => b.StudentId == studentId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<BookingRequest>> GetByTutorIdAsync(Guid tutorId, CancellationToken ct)
    {
        return await _context.BookingRequests
            .Include(b => b.Student)
            .Include(b => b.Tutor)
            .Include(b => b.Review)
            .Include(b => b.Messages)!.ThenInclude(m => m.Sender)
            .Where(b => b.TutorId == tutorId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);
    }


    public async Task<bool> HasPendingRequestAsync(Guid studentId, Guid tutorId, CancellationToken ct)
    {
        return await _context.BookingRequests
            .AnyAsync(b => b.StudentId == studentId
                           && b.TutorId == tutorId
                           && b.Status == Domain.Enums.BookingStatus.Pending, ct);
    }

    public async Task AddAsync(BookingRequest booking, CancellationToken ct)
    {
        await _context.BookingRequests.AddAsync(booking, ct);
    }

    public async Task UpdateAsync(BookingRequest booking, CancellationToken ct)
    {
        _context.BookingRequests.Update(booking);
        await Task.CompletedTask;
    }

    public async Task AddMessageAsync(BookingMessage message, CancellationToken ct)
    {
        await _context.BookingMessages.AddAsync(message, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }

    public async Task<BookingStats> GetStatsByTutorIdAsync(Guid tutorId, CancellationToken ct)
    {
        // Safe implementation: Fetch minimal data and aggregate in memory
        // This avoids complex EF Core GroupBy translation issues that were causing 500 errors
        var bookings = await _context.BookingRequests
            .IgnoreQueryFilters()
            .Where(b => b.TutorId == tutorId)
            .Select(b => new { b.Status, b.PricePerHourAtBooking })
            .ToListAsync(ct);

        if (bookings.Count == 0) return new BookingStats(0, 0, 0, 0m);

        var pending = 0;
        var accepted = 0; // Active
        var completed = 0;
        var earnings = 0m;

        foreach (var b in bookings)
        {
            if (b.Status == Domain.Enums.BookingStatus.Pending) pending++;
            else if (b.Status == Domain.Enums.BookingStatus.Accepted) accepted++;
            else if (b.Status == Domain.Enums.BookingStatus.Completed)
            {
                completed++;
                earnings += b.PricePerHourAtBooking;
            }
        }

        return new BookingStats(pending, accepted, completed, earnings);
    }
}
