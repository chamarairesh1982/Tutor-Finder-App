using NetTopologySuite.Geometries;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Domain.Entities;

public class TutorProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string FullName { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string Bio { get; set; } = string.Empty;
    public Category Category { get; set; }
    
    // Geo
    public decimal BaseLatitude { get; set; }
    public decimal BaseLongitude { get; set; }
    public string Postcode { get; set; } = string.Empty;
    public Point Location { get; set; } = null!; // PostGIS geography point
    public int TravelRadiusMiles { get; set; } = 10;
    
    public decimal PricePerHour { get; set; }
    public TeachingMode TeachingMode { get; set; }
    
    // Badges/Verification
    public bool HasDbs { get; set; }
    public bool HasCertification { get; set; }
    
    // Denormalized/Aggregated
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public double ResponseRate { get; set; } = 100.0;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public List<TutorSubject> Subjects { get; set; } = new();
    public List<AvailabilitySlot> AvailabilitySlots { get; set; } = new();
}
