namespace TutorFinder.Application.Interfaces;

public interface IGeocodingService
{
    Task<(double Lat, double Lng)?> GeocodePostcodeAsync(string postcode, CancellationToken ct);
}
