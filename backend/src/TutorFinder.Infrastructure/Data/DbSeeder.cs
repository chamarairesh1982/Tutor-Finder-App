using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Infrastructure.Data;

public class DbSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly GeometryFactory _geometryFactory;

    public DbSeeder(AppDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public async Task SeedAsync()
    {
        // Don't seed if data already exists
        if (await _context.Users.AnyAsync()) return;

        // 1. Create a Student
        var studentUser = new User
        {
            Email = "student@example.com",
            PasswordHash = _passwordHasher.Hash("Password123!"),
            DisplayName = "Alice Student",
            Role = UserRole.Student
        };
        _context.Users.Add(studentUser);

        // 2. Create Tutors in London
        var londonTutors = CreateLondonTutors();
        _context.Users.AddRange(londonTutors.Select(t => t.User));
        _context.TutorProfiles.AddRange(londonTutors.Select(t => t.Profile));

        // 3. Create Tutors in Manchester
        var manchesterTutors = CreateManchesterTutors();
        _context.Users.AddRange(manchesterTutors.Select(t => t.User));
        _context.TutorProfiles.AddRange(manchesterTutors.Select(t => t.Profile));

        // 4. Create Tutors in Birmingham (New)
        var birminghamTutors = CreateBirminghamTutors();
        _context.Users.AddRange(birminghamTutors.Select(t => t.User));
        _context.TutorProfiles.AddRange(birminghamTutors.Select(t => t.Profile));

        await _context.SaveChangesAsync();

        // 4. Create some Bookings and Reviews for the first tutor to test the rating system
        var firstTutor = londonTutors[0].Profile;
        
        var completedBooking = new BookingRequest
        {
            StudentId = studentUser.Id,
            TutorId = firstTutor.Id,
            PreferredMode = TeachingMode.Online,
            Status = BookingStatus.Completed,
            PricePerHourAtBooking = firstTutor.PricePerHour,
            PreferredDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7))
        };
        _context.BookingRequests.Add(completedBooking);
        await _context.SaveChangesAsync();

        var review = new Review
        {
            BookingRequestId = completedBooking.Id,
            StudentId = studentUser.Id,
            TutorProfileId = firstTutor.Id,
            Rating = 5,
            Comment = "Excellent tutor! Really helped with my calculus."
        };
        _context.Reviews.Add(review);

        // Sync tutor rating
        firstTutor.AverageRating = 5m;
        firstTutor.ReviewCount = 1;
        _context.TutorProfiles.Update(firstTutor);

        await _context.SaveChangesAsync();
    }

    private List<(User User, TutorProfile Profile)> CreateLondonTutors()
    {
        var tutors = new List<(User, TutorProfile)>();

        // Tutor 1: Music
        var user1 = new User { Email = "piano@london.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "James Piano", Role = UserRole.Tutor };
        var profile1 = new TutorProfile
        {
            UserId = user1.Id,
            FullName = "James Smith",
            Bio = "Professional pianist with 10 years of teaching experience. I specialize in classical piano and music theory.",
            Category = Category.Music,
            PricePerHour = 45.00m,
            TeachingMode = TeachingMode.Both,
            Postcode = "WC2N 5DU",
            Location = _geometryFactory.CreatePoint(new Coordinate(-0.1283, 51.5073)), 
            TravelRadiusMiles = 5,
            Subjects = new List<TutorSubject> { new() { SubjectName = "Piano" }, new() { SubjectName = "Music Theory" } }
        };
        tutors.Add((user1, profile1));

        // Tutor 2: Programming
        var user2 = new User { Email = "code@london.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "Sarah Coder", Role = UserRole.Tutor };
        var profile2 = new TutorProfile
        {
            UserId = user2.Id,
            FullName = "Sarah Jenkins",
            Bio = "Senior Software Engineer. Teaching React, Node.js and TypeScript. I help beginners build their first apps.",
            Category = Category.Programming,
            PricePerHour = 60.00m,
            TeachingMode = TeachingMode.Online,
            Postcode = "E1 6AN",
            Location = _geometryFactory.CreatePoint(new Coordinate(-0.0764, 51.5226)),
            TravelRadiusMiles = 10,
            Subjects = new List<TutorSubject> { new() { SubjectName = "React" }, new() { SubjectName = "JavaScript" } }
        };
        tutors.Add((user2, profile2));

        // Tutor 4: English (London)
        var user4 = new User { Email = "lit@london.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "Emma Literature", Role = UserRole.Tutor };
        var profile4 = new TutorProfile
        {
            UserId = user4.Id,
            FullName = "Emma Thompson",
            Bio = "Master's in English Literature. Specializing in Shakespeare and creative writing for all ages.",
            Category = Category.English,
            PricePerHour = 35.00m,
            TeachingMode = TeachingMode.Both,
            Postcode = "N1 9GU",
            Location = _geometryFactory.CreatePoint(new Coordinate(-0.1130, 51.5332)),
            TravelRadiusMiles = 8,
            Subjects = new List<TutorSubject> { new() { SubjectName = "English Lit" }, new() { SubjectName = "Creative Writing" } }
        };
        tutors.Add((user4, profile4));

        return tutors;
    }

    private List<(User User, TutorProfile Profile)> CreateManchesterTutors()
    {
        var tutors = new List<(User, TutorProfile)>();

        // Tutor 3: Maths
        var user3 = new User { Email = "maths@mcr.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "Dr. Miller", Role = UserRole.Tutor };
        var profile3 = new TutorProfile
        {
            UserId = user3.Id,
            FullName = "Dr. Robert Miller",
            Bio = "PhD in Mathematics. 20 years experience in GCSE and A-Level tutoring. Proven track record of grade improvements.",
            Category = Category.Maths,
            PricePerHour = 40.00m,
            TeachingMode = TeachingMode.Both,
            Postcode = "M1 1AG",
            Location = _geometryFactory.CreatePoint(new Coordinate(-2.2426, 53.4808)),
            TravelRadiusMiles = 15,
            Subjects = new List<TutorSubject> { new() { SubjectName = "GCSE Maths" }, new() { SubjectName = "Calculus" } }
        };
        tutors.Add((user3, profile3));

        // Tutor 5: Science (Manchester)
        var user5 = new User { Email = "bio@mcr.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "Dr. Science", Role = UserRole.Tutor };
        var profile5 = new TutorProfile
        {
            UserId = user5.Id,
            FullName = "Dr. Linda Watson",
            Bio = "Biology expert. I help medical students and A-level students master complex biological concepts.",
            Category = Category.Science,
            PricePerHour = 55.00m,
            TeachingMode = TeachingMode.Online,
            Postcode = "M14 4AS",
            Location = _geometryFactory.CreatePoint(new Coordinate(-2.2227, 53.4475)),
            TravelRadiusMiles = 5,
            Subjects = new List<TutorSubject> { new() { SubjectName = "Biology" }, new() { SubjectName = "Chemistry" } }
        };
        tutors.Add((user5, profile5));

        return tutors;
    }

    private List<(User User, TutorProfile Profile)> CreateBirminghamTutors()
    {
        var tutors = new List<(User, TutorProfile)>();

        // Tutor 6: Languages (Birmingham)
        var user6 = new User { Email = "french@brum.com", PasswordHash = _passwordHasher.Hash("Password123!"), DisplayName = "Madame Lefebvre", Role = UserRole.Tutor };
        var profile6 = new TutorProfile
        {
            UserId = user6.Id,
            FullName = "Sophie Lefebvre",
            Bio = "Native French speaker. I focus on conversational French and business language skills.",
            Category = Category.Languages,
            PricePerHour = 30.00m,
            TeachingMode = TeachingMode.Both,
            Postcode = "B1 1QU",
            Location = _geometryFactory.CreatePoint(new Coordinate(-1.8904, 52.4862)),
            TravelRadiusMiles = 12,
            Subjects = new List<TutorSubject> { new() { SubjectName = "French" }, new() { SubjectName = "Spanish" } }
        };
        tutors.Add((user6, profile6));

        return tutors;
    }
}
