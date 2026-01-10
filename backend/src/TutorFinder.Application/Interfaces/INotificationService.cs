namespace TutorFinder.Application.Interfaces;

public interface INotificationService
{
    Task NotifyBookingEventAsync(Guid bookingId, string eventType, Guid recipientUserId, string message, CancellationToken ct);
}
