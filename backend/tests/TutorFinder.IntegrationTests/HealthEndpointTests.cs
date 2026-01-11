using System.Net;
using System.Text.Json;
using FluentAssertions;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class HealthEndpointTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public HealthEndpointTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsHealthyStatus()
    {
        var response = await _client.GetAsync("/api/v1/health");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("status").GetString().Should().NotBeNull();
    }
}
