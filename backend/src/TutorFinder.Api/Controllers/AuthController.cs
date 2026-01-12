using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(request, ct);
        
        return result.Match<IActionResult>(
            success => CreatedAtAction(nameof(Login), success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);

        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await _authService.RefreshTokenAsync(request, ct);

        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await _authService.LogoutAsync(request.RefreshToken, ct);

        return result.Match<IActionResult>(
            success => Ok(),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _authService.MeAsync(userId, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }
}
