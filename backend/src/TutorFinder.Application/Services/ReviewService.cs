using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly ITutorRepository _tutorRepository;

    public ReviewService(
        IReviewRepository reviewRepository,
        IBookingRepository bookingRepository,
        ITutorRepository tutorRepository)
    {
        _reviewRepository = reviewRepository;
        _bookingRepository = bookingRepository;
        _tutorRepository = tutorRepository;
    }

    public async Task<Result<ReviewResponse>> CreateReviewAsync(Guid studentId, CreateReviewRequest request, CancellationToken ct)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingRequestId, ct);
        if (booking == null) return new Result<ReviewResponse>.Failure("Booking not found", 404);

        if (booking.StudentId != studentId) return new Result<ReviewResponse>.Failure("Unauthorized", 403);
        if (booking.Status is not (BookingStatus.Accepted or BookingStatus.Completed))
            return new Result<ReviewResponse>.Failure("Can only review accepted bookings", 400);

        var existingReview = await _reviewRepository.GetByBookingRequestIdAsync(request.BookingRequestId, ct);
        if (existingReview != null)
            return new Result<ReviewResponse>.Failure("Booking already reviewed", 409);

        var review = new Review
        {
            BookingRequestId = request.BookingRequestId,
            StudentId = studentId,
            TutorProfileId = booking.TutorId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        await _reviewRepository.AddAsync(review, ct);
        
        // Update Tutor Aggregates (Simplistic for MVP)
        var tutor = await _tutorRepository.GetByIdAsync(booking.TutorId, ct);
        if (tutor != null)
        {
            var tutorReviews = await _reviewRepository.GetByTutorIdAsync(tutor.Id, ct);
            tutorReviews.Add(review);
            
            tutor.ReviewCount = tutorReviews.Count;
            tutor.AverageRating = (decimal)tutorReviews.Average(r => r.Rating);
            
            await _tutorRepository.UpdateAsync(tutor, ct);
        }

        await _reviewRepository.SaveChangesAsync(ct);

        var fullReview = await _reviewRepository.GetByIdAsync(review.Id, ct);
        return new Result<ReviewResponse>.Success(MapToResponse(fullReview!));
    }

    public async Task<Result<List<ReviewResponse>>> GetTutorReviewsAsync(Guid tutorId, CancellationToken ct)
    {
        var reviews = await _reviewRepository.GetByTutorIdAsync(tutorId, ct);
        return new Result<List<ReviewResponse>>.Success(reviews.Select(MapToResponse).ToList());
    }

    private static ReviewResponse MapToResponse(Review r)
    {
        return new ReviewResponse(
            r.Id,
            r.StudentId,
            r.Student?.DisplayName ?? "Student",
            r.TutorProfileId,
            r.Rating,
            r.Comment,
            r.CreatedAt
        );
    }
}
