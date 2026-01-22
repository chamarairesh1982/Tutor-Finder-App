using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TutorFinder.Api.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // Clients connect automatically. We map them to groups based on User ID in OnConnectedAsync if needed,
    // but the default UserIdentifier provider usually maps Context.UserIdentifier (sub claim) correctly.
    
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendTypingStatus(string bookingId, string recipientId, bool isTyping)
    {
        await Clients.Group($"user_{recipientId}").SendAsync("TypingStatus", bookingId, isTyping);
    }

    public async Task NotifyMessagesRead(string bookingId, string recipientId)
    {
        await Clients.Group($"user_{recipientId}").SendAsync("MessagesRead", bookingId);
    }
}
