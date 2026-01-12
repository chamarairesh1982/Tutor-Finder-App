namespace TutorFinder.Domain.Entities;

public class Favorite
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid TutorProfileId { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public TutorProfile TutorProfile { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
