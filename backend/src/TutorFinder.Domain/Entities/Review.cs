namespace TutorFinder.Domain.Entities;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid BookingRequestId { get; set; }
    public BookingRequest BookingRequest { get; set; } = null!;
    
    public Guid StudentId { get; set; }
    public User Student { get; set; } = null!;
    
    public Guid TutorProfileId { get; set; }
    public TutorProfile Tutor { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
