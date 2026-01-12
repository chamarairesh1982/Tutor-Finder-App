using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string DisplayName,
    UserRole Role
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    Guid Id,
    string Email,
    string DisplayName,
    UserRole Role,
    string Token,
    string? RefreshToken = null,
    DateTime? RefreshTokenExpiresAt = null
);

public record RefreshTokenRequest(
    string RefreshToken
);

public record MeResponse(
    Guid Id,
    string Email,
    string DisplayName,
    UserRole Role
);


public record UpdateProfileRequest(
    string DisplayName,
    string Email
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
