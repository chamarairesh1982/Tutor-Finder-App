using Microsoft.Extensions.Configuration;
using Stripe;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Infrastructure.Services;

public class StripePaymentService : IPaymentService
{
    private readonly string _secretKey;
    private readonly string _publishableKey;

    public StripePaymentService(IConfiguration configuration)
    {
        _secretKey = configuration["Stripe:SecretKey"] ?? "";
        _publishableKey = configuration["Stripe:PublishableKey"] ?? "";
        StripeConfiguration.ApiKey = _secretKey;
    }

    public async Task<PaymentIntentResponse> CreatePaymentIntentAsync(CreatePaymentIntentRequest request)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(request.Amount * 100), // Stripe uses cents
            Currency = request.Currency.ToLower(),
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
            Metadata = new Dictionary<string, string>
            {
                { "BookingId", request.BookingId.ToString() },
                { "UserId", request.UserId ?? "anonymous" }
            }
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        return new PaymentIntentResponse
        {
            ClientSecret = intent.ClientSecret,
            PaymentIntentId = intent.Id,
            PublishableKey = _publishableKey
        };
    }
}
