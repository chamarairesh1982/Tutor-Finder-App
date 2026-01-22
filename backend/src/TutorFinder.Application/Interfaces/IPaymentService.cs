using TutorFinder.Application.DTOs;

namespace TutorFinder.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentIntentResponse> CreatePaymentIntentAsync(CreatePaymentIntentRequest request);
}
