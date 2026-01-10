using NetTopologySuite.Geometries;
using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Services;

public class TutorService : ITutorService
{
    private readonly ITutorRepository _tutorRepository;
    private readonly ITutorSearchRepository _searchRepository;
    private readonly IGeocodingService _geocodingService;
    private readonly GeometryFactory _geometryFactory;

    public TutorService(
        ITutorRepository tutorRepository,
        ITutorSearchRepository searchRepository,
        IGeocodingService geocodingService)
    {
        _tutorRepository = tutorRepository;
        _searchRepository = searchRepository;
        _geocodingService = geocodingService;
        // WGS84
        _geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public async Task<Result<TutorProfileResponse>> UpsertProfileAsync(Guid userId, TutorProfileRequest request, CancellationToken ct)
    {
        var profile = await _tutorRepository.GetByUserIdAsync(userId, ct);
        bool isNew = profile == null;

        if (isNew)
        {
            profile = new TutorProfile { UserId = userId };
        }

        profile!.FullName = request.FullName;
        profile.Bio = request.Bio;
        profile.Category = request.Category;
        profile.BaseLatitude = request.BaseLatitude;
        profile.BaseLongitude = request.BaseLongitude;
        profile.Postcode = request.Postcode;
        profile.TravelRadiusMiles = request.TravelRadiusMiles;
        profile.PricePerHour = request.PricePerHour;
        profile.TeachingMode = request.TeachingMode;
        profile.UpdatedAt = DateTime.UtcNow;

        // Update Location Point
        profile.Location = _geometryFactory.CreatePoint(new Coordinate((double)request.BaseLongitude, (double)request.BaseLatitude));

        // Update Subjects (Simple clear and re-add for MVP)
        profile.Subjects.Clear();
        profile.Subjects.AddRange(request.Subjects.Select(s => new TutorSubject { SubjectName = s }));

        // Update Availability (Simple clear and re-add for MVP)
        profile.AvailabilitySlots.Clear();
        profile.AvailabilitySlots.AddRange(request.Availability.Select(a => new AvailabilitySlot
        {
            DayOfWeek = a.DayOfWeek,
            StartTime = a.StartTime,
            EndTime = a.EndTime
        }));

        if (isNew)
        {
            await _tutorRepository.AddAsync(profile, ct);
        }
        else
        {
            await _tutorRepository.UpdateAsync(profile, ct);
        }

        await _tutorRepository.SaveChangesAsync(ct);

        return new Result<TutorProfileResponse>.Success(MapToResponse(profile));
    }

    public async Task<Result<TutorProfileResponse>> GetProfileByUserIdAsync(Guid userId, CancellationToken ct)
    {
        var profile = await _tutorRepository.GetByUserIdAsync(userId, ct);
        if (profile == null) return new Result<TutorProfileResponse>.Failure("Profile not found", 404);

        return new Result<TutorProfileResponse>.Success(MapToResponse(profile));
    }

    public async Task<Result<TutorProfileResponse>> GetProfileByIdAsync(Guid tutorId, CancellationToken ct)
    {
        var profile = await _tutorRepository.GetByIdAsync(tutorId, ct);
        if (profile == null) return new Result<TutorProfileResponse>.Failure("Profile not found", 404);

        return new Result<TutorProfileResponse>.Success(MapToResponse(profile));
    }

    public async Task<Result<PagedResult<TutorSearchResultDto>>> SearchAsync(TutorSearchRequest request, CancellationToken ct)
    {
        var updatedRequest = request;

        if (!string.IsNullOrEmpty(request.Postcode) && (!request.Lat.HasValue || !request.Lng.HasValue))
        {
            var coords = await _geocodingService.GeocodePostcodeAsync(request.Postcode, ct);
            if (coords.HasValue)
            {
                updatedRequest = request with { Lat = coords.Value.Lat, Lng = coords.Value.Lng };
            }
        }

        var results = await _searchRepository.SearchAsync(updatedRequest, ct);
        return new Result<PagedResult<TutorSearchResultDto>>.Success(results);
    }


    private static TutorProfileResponse MapToResponse(TutorProfile profile)
    {
        return new TutorProfileResponse(
            profile.Id,
            profile.UserId,
            profile.FullName,
            profile.PhotoUrl,
            profile.Bio,
            profile.Category,
            profile.BaseLatitude,
            profile.BaseLongitude,
            profile.Postcode,
            profile.TravelRadiusMiles,
            profile.PricePerHour,
            profile.TeachingMode,
            profile.Subjects.Select(s => s.SubjectName).ToList(),
            profile.AverageRating,
            profile.ReviewCount,
            profile.IsActive,
            ComputeNextAvailableText(profile.AvailabilitySlots),
            "Typically responds within a few hours"
        );
    }

    private static string? ComputeNextAvailableText(ICollection<AvailabilitySlot> slots)
    {
        if (slots == null || slots.Count == 0) return null;

        var now = DateTime.UtcNow;
        var today = now.DayOfWeek;

        var ordered = slots
            .Select(s => new
            {
                Slot = s,
                OffsetDays = ((int)s.DayOfWeek - (int)today + 7) % 7,
                s.StartTime
            })
            .OrderBy(x => x.OffsetDays)
            .ThenBy(x => x.StartTime)
            .FirstOrDefault();

        if (ordered == null) return null;

        var nextDate = now.Date.AddDays(ordered.OffsetDays);
        return ordered.OffsetDays == 0
            ? $"Next available today at {ordered.Slot.StartTime:HH:mm}"
            : $"Next available {nextDate:ddd} at {ordered.Slot.StartTime:HH:mm}";
    }
}

