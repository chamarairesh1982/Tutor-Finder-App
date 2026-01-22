using System.Net.Http.Json;
using TutorFinder.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System.Threading;
using System.Threading.Tasks;

namespace TutorFinder.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public GeocodingService(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }

    public async Task<(double Lat, double Lng)?> GeocodePostcodeAsync(string postcode, CancellationToken ct)
    {
        var cacheKey = $"geo:{postcode.ToLowerInvariant()}";
        if (_cache.TryGetValue(cacheKey, out (double Lat, double Lng)? cached))
        {
            return cached;
        }

        try
        {
            // Using postcodes.io (Free UK postcode lookup)
            var response = await _httpClient.GetAsync($"https://api.postcodes.io/postcodes/{postcode}", ct);
            if (!response.IsSuccessStatusCode) return null;

            var result = await response.Content.ReadFromJsonAsync<PostcodeResponse>(cancellationToken: ct);
            if (result?.Status == 200 && result.Result != null)
            {
                var outcome = (result.Result.Latitude, result.Result.Longitude);
                _cache.Set(cacheKey, outcome, TimeSpan.FromHours(24));
                return outcome;
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
