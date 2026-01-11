using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using TutorFinder.Application.DTOs;
using TutorFinder.Domain.Enums;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class TutorProfileCrudTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public TutorProfileCrudTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task TutorCreateAndUpdateProfile_WorksAndEnforcesOwnership()
    {
        var email = $"tutor_{Guid.NewGuid():N}@example.com";

        var registerResponse = await _client.PostAsJsonAsync(
            "/api/v1/auth/register",
            new RegisterRequest(email, "Password123!", "Tutor User", UserRole.Tutor)
        );
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var loginResponse = await _client.PostAsJsonAsync(
            "/api/v1/auth/login",
            new LoginRequest(email, "Password123!")
        );
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        auth.Should().NotBeNull();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);

        var createRequest = new TutorProfileRequest(
            "Tutor User",
            "Bio",
            Category.Maths,
            51.5014m,
            -0.1419m,
            "SW1A 1AA",
            10,
            40m,
            TeachingMode.Both,
            new List<string> { "GCSE Maths" },
            new List<AvailabilitySlotRequest>
            {
                new AvailabilitySlotRequest(DayOfWeek.Monday, new TimeOnly(17,0), new TimeOnly(19,0))
            }
        );

        var createProfileResponse = await _client.PostAsJsonAsync("/api/v1/tutors", createRequest);
        createProfileResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createProfileResponse.Content.ReadFromJsonAsync<TutorProfileResponse>();
        created.Should().NotBeNull();
        created!.Postcode.Should().Be("SW1A 1AA");

        var updateRequest = createRequest with { Bio = "Updated bio" };
        var updateResponse = await _client.PutAsJsonAsync($"/api/v1/tutors/{created.Id}", updateRequest);
        if (updateResponse.StatusCode != HttpStatusCode.OK)
        {
            var body = await updateResponse.Content.ReadAsStringAsync();
            throw new Xunit.Sdk.XunitException($"Expected 200 OK but got {(int)updateResponse.StatusCode} {updateResponse.StatusCode}. Body: {body}");
        }


        var updated = await updateResponse.Content.ReadFromJsonAsync<TutorProfileResponse>();
        updated!.Bio.Should().Be("Updated bio");

        // Another tutor shouldn't be able to update this profile
        var otherEmail = $"tutor_{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync(
            "/api/v1/auth/register",
            new RegisterRequest(otherEmail, "Password123!", "Other Tutor", UserRole.Tutor)
        );
        var otherLogin = await _client.PostAsJsonAsync(
            "/api/v1/auth/login",
            new LoginRequest(otherEmail, "Password123!")
        );
        var otherAuth = await otherLogin.Content.ReadFromJsonAsync<AuthResponse>();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", otherAuth!.Token);

        var forbidden = await _client.PutAsJsonAsync($"/api/v1/tutors/{created.Id}", updateRequest);
        forbidden.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
