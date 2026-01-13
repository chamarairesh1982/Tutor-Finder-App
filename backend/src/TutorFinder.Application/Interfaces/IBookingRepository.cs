using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Interfaces;

public interface IBookingRepository
{
    Task<BookingRequest?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<List<BookingRequest>> GetByStudentIdAsync(Guid studentId, CancellationToken ct);
    Task<List<BookingRequest>> GetByTutorIdAsync(Guid tutorId, CancellationToken ct);
    Task<bool> HasPendingRequestAsync(Guid studentId, Guid tutorId, CancellationToken ct);
    Task AddAsync(BookingRequest booking, CancellationToken ct);
    Task UpdateAsync(BookingRequest booking, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
    
    Task AddMessageAsync(BookingMessage message, CancellationToken ct);
    Task<BookingStats> GetStatsByTutorIdAsync(Guid tutorId, CancellationToken ct);
}

public record BookingStats(int Pending, int Accepted, int Completed, decimal Earnings);

