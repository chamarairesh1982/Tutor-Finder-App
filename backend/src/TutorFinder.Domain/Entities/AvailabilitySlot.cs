namespace TutorFinder.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TutorProfileId { get; set; }
    
    public DayOfWeek DayOfWeek { get; set; } // 0..6
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
