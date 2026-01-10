using Microsoft.Extensions.Logging;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(ILogger<NotificationService> logger)
    {
        _logger = logger;
    }

    public Task NotifyBookingEventAsync(Guid bookingId, string eventType, Guid recipientUserId, string message, CancellationToken ct)
    {
        _logger.LogInformation("Notification stub: booking {BookingId} event {EventType} to user {UserId}: {Message}", bookingId, eventType, recipientUserId, message);
        return Task.CompletedTask;
    }
}
