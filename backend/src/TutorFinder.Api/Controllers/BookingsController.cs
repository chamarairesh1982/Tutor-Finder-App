using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.CreateBookingAsync(userId, request, ct);
        return result.Match<IActionResult>(
            success => CreatedAtAction(nameof(GetBooking), new { id = success.Id }, success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBookings(CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.GetMyBookingsAsync(userId, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.GetBookingByIdAsync(userId, id, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("{id}/respond")]
    public async Task<IActionResult> RespondToBooking(Guid id, [FromBody] RespondToBookingRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.RespondToBookingAsync(userId, id, request, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromBody] CancelBookingRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.CancelBookingAsync(userId, id, request ?? new CancelBookingRequest(null), ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteBooking(Guid id, [FromBody] CompleteBookingRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.CompleteBookingAsync(userId, id, request ?? new CompleteBookingRequest(null), ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendMessageRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _bookingService.SendMessageAsync(userId, id, request, ct);
        return result.Match<IActionResult>(
            success => Ok(success),
            failure => Problem(failure.Message, statusCode: failure.StatusCode)
        );
    }

    private Guid GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdString, out var userId)) return userId;
        throw new UnauthorizedAccessException();
    }
}

