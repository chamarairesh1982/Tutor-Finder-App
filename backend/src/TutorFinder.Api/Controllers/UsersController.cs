using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userService.UpdateProfileAsync(userId, request, ct);

        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [Authorize]
    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userService.ChangePasswordAsync(userId, request, ct);

        return result.Match<IActionResult>(
            success => Ok(new { message = "Password changed successfully" }),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }
}
