using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TutorsController : ControllerBase
{
    private readonly ITutorService _tutorService;

    public TutorsController(ITutorService tutorService)
    {
        _tutorService = tutorService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyProfile(CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _tutorService.GetProfileByUserIdAsync(userId, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    // New, spec-aligned endpoints (keep /profile for backward compatibility)

    [HttpPost]
    [Authorize(Policy = "TutorOnly")]
    public async Task<IActionResult> CreateProfile([FromBody] TutorProfileRequest request, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _tutorService.CreateProfileAsync(userId, request, ct);
        return result.Match<IActionResult>(
            success => CreatedAtAction(nameof(GetProfile), new { id = success.Id }, success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "TutorOnly")]
    public async Task<IActionResult> UpdateProfile(Guid id, [FromBody] TutorProfileRequest request, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _tutorService.UpdateProfileAsync(userId, id, request, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("profile")]
    [Authorize(Policy = "TutorOnly")]
    public async Task<IActionResult> UpsertProfile([FromBody] TutorProfileRequest request, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();
 
        var result = await _tutorService.UpsertProfileAsync(userId, request, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(Guid id, CancellationToken ct)
    {
        var result = await _tutorService.GetProfileByIdAsync(id, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] TutorSearchRequest request, CancellationToken ct)
    {
        var normalized = request with { Page = request.Page <= 0 ? 1 : request.Page, PageSize = request.PageSize <= 0 ? 20 : request.PageSize };
        var result = await _tutorService.SearchAsync(normalized, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }
}

