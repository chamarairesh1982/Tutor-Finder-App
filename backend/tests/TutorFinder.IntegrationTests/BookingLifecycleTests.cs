using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using TutorFinder.Application.DTOs;
using TutorFinder.Domain.Enums;
using Xunit;

namespace TutorFinder.IntegrationTests;

public class BookingLifecycleTests : IClassFixture<SqlServerWebFactory>
{
    private readonly HttpClient _client;

    public BookingLifecycleTests(SqlServerWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task StudentCreates_TutorAccepts_TutorCompletes_StudentReviews()
    {
        // Student login (seeded)
        var studentLogin = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("student@example.com", "Password123!"));
        studentLogin.StatusCode.Should().Be(HttpStatusCode.OK);
        var studentAuth = await studentLogin.Content.ReadFromJsonAsync<AuthResponse>();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", studentAuth!.Token);

        // Find a tutor via search
        var searchResponse = await _client.GetAsync("/api/v1/tutors/search?postcode=SW1A%201AA&radiusMiles=10&page=1&pageSize=5&sortBy=best");
        searchResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var searchJson = await searchResponse.Content.ReadFromJsonAsync<PagedResult<TutorSearchResultDto>>();
        searchJson.Should().NotBeNull();
        searchJson!.Items.Should().NotBeEmpty();

        var tutor = searchJson.Items[0];

        // Create booking
        var createBooking = await _client.PostAsJsonAsync(
            "/api/v1/bookings",
            new CreateBookingRequest(tutor.Id, TeachingMode.Online, "Next week", "Hi, can you help me with GCSE maths?")
        );
        createBooking.StatusCode.Should().Be(HttpStatusCode.Created);

        var booking = await createBooking.Content.ReadFromJsonAsync<BookingResponse>();
        booking.Should().NotBeNull();
        booking!.Status.Should().Be(BookingStatus.Pending);

        // Tutor login (seeded tutor user is linked to tutor profile; use email from seeded data)
        // Pick one known seeded tutor email: piano@london.com
        var tutorLogin = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("piano@london.com", "Password123!"));
        tutorLogin.StatusCode.Should().Be(HttpStatusCode.OK);
        var tutorAuth = await tutorLogin.Content.ReadFromJsonAsync<AuthResponse>();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tutorAuth!.Token);

        // Accept booking
        var acceptResponse = await _client.PostAsJsonAsync($"/api/v1/bookings/{booking.Id}/respond", new RespondToBookingRequest(BookingStatus.Accepted, "Sure."));
        acceptResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var accepted = await acceptResponse.Content.ReadFromJsonAsync<BookingResponse>();
        accepted!.Status.Should().Be(BookingStatus.Accepted);

        // Complete booking
        var completeResponse = await _client.PostAsJsonAsync($"/api/v1/bookings/{booking.Id}/complete", new CompleteBookingRequest("Done"));
        completeResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var completed = await completeResponse.Content.ReadFromJsonAsync<BookingResponse>();
        completed!.Status.Should().Be(BookingStatus.Completed);

        // Student review
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", studentAuth.Token);
        var reviewResponse = await _client.PostAsJsonAsync("/api/v1/reviews", new CreateReviewRequest(booking.Id, 5, "Great tutor"));
        reviewResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        // Duplicate review should fail
        var duplicateReview = await _client.PostAsJsonAsync("/api/v1/reviews", new CreateReviewRequest(booking.Id, 5, "Great tutor"));
        duplicateReview.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
