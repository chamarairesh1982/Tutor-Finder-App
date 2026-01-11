using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using TutorFinder.Application.DTOs;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class MeEndpointTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public MeEndpointTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task AuthMe_WhenUnauthorized_Returns401()
    {
        var response = await _client.GetAsync("/api/v1/auth/me");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AuthMe_WhenAuthorized_ReturnsUser()
    {
        var loginResponse = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("student@example.com", "Password123!"));
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        auth.Should().NotBeNull();
        auth!.Token.Should().NotBeNullOrWhiteSpace();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.Token);

        var meResponse = await _client.GetAsync("/api/v1/auth/me");
        meResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var me = await meResponse.Content.ReadFromJsonAsync<MeResponse>();
        me.Should().NotBeNull();
        me!.Email.Should().Be("student@example.com");
    }
}
