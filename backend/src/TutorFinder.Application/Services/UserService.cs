using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null) return new Result<AuthResponse>.Failure("User not found", 404);

        if (user.Email != request.Email)
        {
            var exists = await _userRepository.ExistsByEmailAsync(request.Email, ct);
            if (exists) return new Result<AuthResponse>.Failure("Email already in use", 409);
        }

        user.DisplayName = request.DisplayName;
        user.Email = request.Email;

        await _userRepository.UpdateAsync(user, ct);
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

    public async Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null) return new Result<bool>.Failure("User not found", 404);

        if (!_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return new Result<bool>.Failure("Invalid current password", 400);
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);

        await _userRepository.UpdateAsync(user, ct);
        await _userRepository.SaveChangesAsync(ct);

        return new Result<bool>.Success(true);
    }
}
