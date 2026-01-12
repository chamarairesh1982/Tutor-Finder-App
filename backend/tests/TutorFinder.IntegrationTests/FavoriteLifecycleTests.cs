using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Common;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class FavoriteLifecycleTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public FavoriteLifecycleTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task FavoriteLifecycle_ShouldWork_Add_Check_List_Remove()
    {
        // 1. Login as student
        var studentLogin = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("student@example.com", "Password123!"));
        studentLogin.StatusCode.Should().Be(HttpStatusCode.OK);
        var studentAuth = await studentLogin.Content.ReadFromJsonAsync<AuthResponse>();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", studentAuth!.Token);

        // 2. Find a tutor
        var searchResponse = await _client.GetAsync("/api/v1/tutors/search?postcode=SW1A%201AA&radiusMiles=10&page=1&pageSize=5&sortBy=best");
        var searchJson = await searchResponse.Content.ReadFromJsonAsync<PagedResult<TutorSearchResultDto>>();
        var tutor = searchJson!.Items[0];

        // 3. Check if favorited (should be false)
        var checkInitial = await _client.GetAsync($"/api/v1/favorites/{tutor.Id}/check");
        checkInitial.StatusCode.Should().Be(HttpStatusCode.OK);
        var initialJson = await checkInitial.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
        initialJson.GetProperty("isFavorite").GetBoolean().Should().BeFalse();

        // 4. Add to favorites
        var addResponse = await _client.PostAsJsonAsync("/api/v1/favorites", new AddFavoriteRequest(tutor.Id));
        addResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var favorite = await addResponse.Content.ReadFromJsonAsync<FavoriteResponse>();
        favorite!.TutorProfileId.Should().Be(tutor.Id);

        // 5. Check if favorited (should be true)
        var checkAfter = await _client.GetAsync($"/api/v1/favorites/{tutor.Id}/check");
        var afterJson = await checkAfter.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
        afterJson.GetProperty("isFavorite").GetBoolean().Should().BeTrue();

        // 6. List favorites
        var listResponse = await _client.GetAsync("/api/v1/favorites");
        listResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var list = await listResponse.Content.ReadFromJsonAsync<List<FavoriteResponse>>();
        list.Should().Contain(f => f.TutorProfileId == tutor.Id);

        // 7. Remove from favorites
        var removeResponse = await _client.DeleteAsync($"/api/v1/favorites/{tutor.Id}");
        removeResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // 8. Check if favorited (should be false again)
        var checkFinal = await _client.GetAsync($"/api/v1/favorites/{tutor.Id}/check");
        var finalJson = await checkFinal.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
        finalJson.GetProperty("isFavorite").GetBoolean().Should().BeFalse();
    }
}
