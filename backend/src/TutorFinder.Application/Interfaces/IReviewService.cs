using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IReviewService
{
    Task<Result<ReviewResponse>> CreateReviewAsync(Guid studentId, CreateReviewRequest request, CancellationToken ct);
    Task<Result<List<ReviewResponse>>> GetTutorReviewsAsync(Guid tutorId, CancellationToken ct);
}
