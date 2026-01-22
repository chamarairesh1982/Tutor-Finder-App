using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Moq; // Assuming Moq is used in the project, otherwise I'll need to check.
using Moq.Protected;
using TutorFinder.Infrastructure.Services;
using Xunit; // Assuming Xunit

namespace TutorFinder.UnitTests.Services;

public class GeocodingServiceTests
{
    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _memoryCache;
    private readonly GeocodingService _service;

    public GeocodingServiceTests()
    {
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
        _service = new GeocodingService(_httpClient, _memoryCache);
    }

    [Fact]
    public async Task GeocodePostcodeAsync_ReturnsCachedValue_WhenAvailable()
    {
        // Arrange
        var postcode = "SW1A 1AA";
        var cacheKey = $"geo:{postcode.ToLowerInvariant()}";
        var expected = (Lat: 51.501, Lng: -0.142);
        
        _memoryCache.Set(cacheKey, expected);

        // Act
        var result = await _service.GeocodePostcodeAsync(postcode, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expected.Lat, result.Value.Lat);
        Assert.Equal(expected.Lng, result.Value.Lng);
        
        // Verify HttpClient was NOT called
        _httpMessageHandlerMock.Protected().Verify(
            "SendAsync",
            Times.Never(),
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>()
        );
    }
}
