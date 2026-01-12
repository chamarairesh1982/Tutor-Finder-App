using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    /// <summary>
    /// Add a tutor to favorites
    /// </summary>
    [HttpPost]
    [ProducesResponseType<FavoriteResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteRequest request, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _favoriteService.AddFavoriteAsync(userId, request.TutorProfileId, ct);
        
        return result.Match<IActionResult>(
            success => CreatedAtAction(nameof(GetMyFavorites), null, success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    /// <summary>
    /// Remove a tutor from favorites
    /// </summary>
    [HttpDelete("{tutorId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveFavorite(Guid tutorId, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _favoriteService.RemoveFavoriteAsync(userId, tutorId, ct);
        
        return result.Match<IActionResult>(
            success => NoContent(),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    /// <summary>
    /// Get current user's favorites
    /// </summary>
    [HttpGet]
    [ProducesResponseType<List<FavoriteResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyFavorites(CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _favoriteService.GetMyFavoritesAsync(userId, ct);
        
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    /// <summary>
    /// Check if a tutor is favorited
    /// </summary>
    [HttpGet("{tutorId:guid}/check")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    public async Task<IActionResult> IsFavorite(Guid tutorId, CancellationToken ct)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var result = await _favoriteService.IsFavoriteAsync(userId, tutorId, ct);
        
        return result.Match<IActionResult>(
            success => Ok(new { isFavorite = success }),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }
}
