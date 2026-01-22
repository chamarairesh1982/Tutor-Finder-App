using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Api.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/payments")]
[ApiController]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create-intent")]
    public async Task<ActionResult<PaymentIntentResponse>> CreateIntent(CreatePaymentIntentRequest request)
    {
        var result = await _paymentService.CreatePaymentIntentAsync(request);
        return Ok(result);
    }
}
