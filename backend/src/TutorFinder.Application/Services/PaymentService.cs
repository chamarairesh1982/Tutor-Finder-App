using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Application.Services;

public class PaymentService : IPaymentService
{
    private const string MockPublishableKey = "pk_test_mock_12345";

    public Task<PaymentIntentResponse> CreatePaymentIntentAsync(CreatePaymentIntentRequest request)
    {
        // In a real implementation, call Stripe SDK here.
        // For now, return a mock success response.
        
        return Task.FromResult(new PaymentIntentResponse
        {
            ClientSecret = $"pi_mock_{Guid.NewGuid()}_secret_{Guid.NewGuid()}",
            PaymentIntentId = $"pi_mock_{Guid.NewGuid()}",
            PublishableKey = MockPublishableKey
        });
    }
}
