using TutorFinder.Domain.Enums;

namespace TutorFinder.Domain.Entities;

public class BookingRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid StudentId { get; set; }
    public User Student { get; set; } = null!;
    
    public Guid TutorId { get; set; }
    public TutorProfile Tutor { get; set; } = null!;
    
    public TeachingMode PreferredMode { get; set; }
    public string? PreferredDate { get; set; }
    public decimal PricePerHourAtBooking { get; set; }
    
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public List<BookingMessage> Messages { get; set; } = new();
    public Review? Review { get; set; }
}

public class BookingMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingRequestId { get; set; }
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}
