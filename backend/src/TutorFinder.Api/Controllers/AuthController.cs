using Microsoft.AspNetCore.Mvc;
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
}
