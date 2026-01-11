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

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
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

        return new Result<AuthResponse>.Success(new AuthResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role,
            token
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

        return new Result<AuthResponse>.Success(new AuthResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.Role,
            token
        ));
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
}
