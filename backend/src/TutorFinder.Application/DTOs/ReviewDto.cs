namespace TutorFinder.Application.DTOs;

public record CreateReviewRequest(
    Guid BookingRequestId,
    int Rating,
    string Comment
);

public record ReviewResponse(
    Guid Id,
    Guid StudentId,
    string StudentName,
    Guid TutorProfileId,
    int Rating,
    string Comment,
    DateTime CreatedAt
);
