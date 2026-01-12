using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email, ct))
        {
            return new Result<AuthResponse>.Failure("User with this email already exists.", 409);
        }

        var user = new User
        {
            Email = request.Email,
            DisplayName = request.DisplayName,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = request.Role
        };

        await _userRepository.AddAsync(user, ct);
        await _userRepository.SaveChangesAsync(ct);

        var token = _jwtService.GenerateToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, ct);

        return new Result<AuthResponse>.Success(new AuthResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role,
            token,
            refreshToken.Token,
            refreshToken.ExpiresAt
        ));
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, ct);

        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return new Result<AuthResponse>.Failure("Invalid email or password.", 401);
        }

        var token = _jwtService.GenerateToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, ct);

        return new Result<AuthResponse>.Success(new AuthResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role,
            token,
            refreshToken.Token,
            refreshToken.ExpiresAt
        ));
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct)
    {
        var storedToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, ct);

        if (storedToken == null)
            return new Result<AuthResponse>.Failure("Invalid refresh token.", 401);

        if (storedToken.IsRevoked)
        {
            // SECURE ROTATION: If a revoked token is used, someone might be trying to reuse an old token.
            // Revoke the entire family for safety.
            await _refreshTokenRepository.RevokeByFamilyAsync(storedToken.TokenFamily, $"Reuse attempted of revoked token {storedToken.Id}", ct);
            await _refreshTokenRepository.SaveChangesAsync(ct);
            return new Result<AuthResponse>.Failure("Token reuse detected. All tokens revoked.", 401);
        }

        if (storedToken.IsExpired)
            return new Result<AuthResponse>.Failure("Refresh token expired.", 401);

        // Valid token, rotate it
        var user = storedToken.User;
        var newAccessToken = _jwtService.GenerateToken(user);
        
        // Revoke the old token
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedReason = "Rotated";

        // Create new token in same family
        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N"),
            TokenFamily = storedToken.TokenFamily,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken, ct);
        await _refreshTokenRepository.SaveChangesAsync(ct);

        return new Result<AuthResponse>.Success(new AuthResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role,
            newAccessToken,
            newRefreshToken.Token,
            newRefreshToken.ExpiresAt
        ));
    }

    public async Task<Result<bool>> LogoutAsync(string token, CancellationToken ct)
    {
        var storedToken = await _refreshTokenRepository.GetByTokenAsync(token, ct);
        if (storedToken == null) return new Result<bool>.Success(true); // Already gone

        await _refreshTokenRepository.RevokeByFamilyAsync(storedToken.TokenFamily, "Logout", ct);
        await _refreshTokenRepository.SaveChangesAsync(ct);

        return new Result<bool>.Success(true);
    }

    public async Task<Result<MeResponse>> MeAsync(Guid userId, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null) return new Result<MeResponse>.Failure("User not found", 404);

        return new Result<MeResponse>.Success(new MeResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role
        ));
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId, CancellationToken ct)
    {
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N"),
            TokenFamily = Guid.NewGuid().ToString("N"), // New family for new login
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(refreshToken, ct);
        await _refreshTokenRepository.SaveChangesAsync(ct);

        return refreshToken;
    }
}
