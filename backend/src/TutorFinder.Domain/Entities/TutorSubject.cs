namespace TutorFinder.Domain.Entities;

public class TutorSubject
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TutorProfileId { get; set; }
    public string SubjectName { get; set; } = string.Empty; // e.g., "Piano", "Calculus"
}
