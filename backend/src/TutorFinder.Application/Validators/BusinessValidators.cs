using FluentValidation;
using TutorFinder.Application.DTOs;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Validators;


public class TutorProfileRequestValidator : AbstractValidator<TutorProfileRequest>
{
    public TutorProfileRequestValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Bio).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Category).IsInEnum();
        RuleFor(x => x.BaseLatitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.BaseLongitude).InclusiveBetween(-180, 180);
        RuleFor(x => x.Postcode).NotEmpty().MaximumLength(10);
        RuleFor(x => x.TravelRadiusMiles).GreaterThan(0);
        RuleFor(x => x.PricePerHour).GreaterThan(0);
        RuleFor(x => x.TeachingMode).IsInEnum();
        RuleFor(x => x.Subjects).NotEmpty();
        RuleForEach(x => x.Subjects).NotEmpty();
    }
}

public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingRequestValidator()
    {
        RuleFor(x => x.TutorId).NotEmpty();
        RuleFor(x => x.PreferredMode).IsInEnum();
        RuleFor(x => x.InitialMessage).MaximumLength(2000);
    }
}

public class RespondToBookingRequestValidator : AbstractValidator<RespondToBookingRequest>
{
    public RespondToBookingRequestValidator()
    {
        RuleFor(x => x.NewStatus)
            .Must(s => s == BookingStatus.Accepted || s == BookingStatus.Declined)
            .WithMessage("Only Accepted or Declined are allowed.");
        RuleFor(x => x.Message).MaximumLength(2000);
    }
}

public class CancelBookingRequestValidator : AbstractValidator<CancelBookingRequest>
{
    public CancelBookingRequestValidator()
    {
        RuleFor(x => x.Message).MaximumLength(2000);
    }
}

public class CompleteBookingRequestValidator : AbstractValidator<CompleteBookingRequest>
{
    public CompleteBookingRequestValidator()
    {
        RuleFor(x => x.Message).MaximumLength(2000);
    }
}

public class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.BookingRequestId).NotEmpty();
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(1000);
    }
}

