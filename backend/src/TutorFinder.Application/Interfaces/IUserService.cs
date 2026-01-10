using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IUserService
{
    Task<Result<AuthResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct);
    Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken ct);
}
