namespace TutorFinder.Application.DTOs;

public class CreatePaymentIntentRequest
{
    public Guid BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "gbp";
}

public class PaymentIntentResponse
{
    public string ClientSecret { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty; // For frontend config
}
