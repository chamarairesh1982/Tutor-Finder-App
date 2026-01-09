using System.Net.Http.Json;
using TutorFinder.Application.Interfaces;

namespace TutorFinder.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;

    public GeocodingService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<(double Lat, double Lng)?> GeocodePostcodeAsync(string postcode, CancellationToken ct)
    {
        try
        {
            // Using postcodes.io (Free UK postcode lookup)
            var response = await _httpClient.GetAsync($"https://api.postcodes.io/postcodes/{postcode}", ct);
            if (!response.IsSuccessStatusCode) return null;

            var result = await response.Content.ReadFromJsonAsync<PostcodeResponse>(cancellationToken: ct);
            if (result?.Status == 200 && result.Result != null)
            {
                return (result.Result.Latitude, result.Result.Longitude);
            }
        }
        catch
        {
            // Log error
        }

        return null;
    }

    private record PostcodeResponse(int Status, PostcodeResult? Result);
    private record PostcodeResult(double Latitude, double Longitude);
}
