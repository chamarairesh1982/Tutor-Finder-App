using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct);
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken ct);
    Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct);
    Task<Result<bool>> LogoutAsync(string token, CancellationToken ct);
    Task<Result<MeResponse>> MeAsync(Guid userId, CancellationToken ct);
}

