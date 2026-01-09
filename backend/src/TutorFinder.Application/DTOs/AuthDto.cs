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
    string Token
);
