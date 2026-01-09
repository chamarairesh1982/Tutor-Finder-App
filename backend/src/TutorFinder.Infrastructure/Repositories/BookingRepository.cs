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
            .Include(b => b.Messages)
                .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
    }

    public async Task<List<BookingRequest>> GetByStudentIdAsync(Guid studentId, CancellationToken ct)
    {
        return await _context.BookingRequests
            .Include(b => b.Tutor)
            .Include(b => b.Student)
            .Where(b => b.StudentId == studentId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<BookingRequest>> GetByTutorIdAsync(Guid tutorId, CancellationToken ct)
    {
        return await _context.BookingRequests
            .Include(b => b.Student)
            .Include(b => b.Tutor)
            .Where(b => b.TutorId == tutorId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);
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
}
