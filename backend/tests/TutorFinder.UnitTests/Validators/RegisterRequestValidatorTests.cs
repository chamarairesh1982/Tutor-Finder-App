using FluentAssertions;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Validators;
using TutorFinder.Domain.Enums;
using Xunit;

namespace TutorFinder.UnitTests.Validators;

public class RegisterRequestValidatorTests
{
    [Fact]
    public void Validate_WhenValidRequest_ReturnsValid()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest("test@example.com", "Password123!", "Test User", UserRole.Student);

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_WhenMissingEmail_ReturnsInvalid()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest("", "Password123!", "Test User", UserRole.Student);

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }
}
