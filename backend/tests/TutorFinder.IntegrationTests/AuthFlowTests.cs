using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TutorFinder.Application.DTOs;
using TutorFinder.Domain.Enums;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class AuthFlowTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public AuthFlowTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task RegisterAndLogin_ReturnsToken()
    {
        var email = $"test_{Guid.NewGuid():N}@example.com";
        var registerRequest = new RegisterRequest(email, "Password123!", "Integration User", UserRole.Student);

        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", registerRequest);
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var loginRequest = new LoginRequest(email, "Password123!");
        var loginResponse = await _client.PostAsJsonAsync("/api/v1/auth/login", loginRequest);
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        payload.Should().NotBeNull();
        payload!.Token.Should().NotBeNullOrWhiteSpace();
    }
}
