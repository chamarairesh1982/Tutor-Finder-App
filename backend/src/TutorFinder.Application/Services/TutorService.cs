using NetTopologySuite.Geometries;
using TutorFinder.Application.Common;
using TutorFinder.Application.DTOs;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.Application.Services;

public class TutorService : ITutorService
{
    private readonly ITutorRepository _tutorRepository;
    private readonly ITutorSearchRepository _searchRepository;
    private readonly IGeocodingService _geocodingService;
    private readonly IBookingRepository _bookingRepository;
    private readonly GeometryFactory _geometryFactory;

    public TutorService(
        ITutorRepository tutorRepository,
        ITutorSearchRepository searchRepository,
        IGeocodingService geocodingService,
        IBookingRepository bookingRepository)
    {
        _tutorRepository = tutorRepository;
        _searchRepository = searchRepository;
        _geocodingService = geocodingService;
        _bookingRepository = bookingRepository;
        // WGS84
        _geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public async Task<Result<TutorProfileResponse>> CreateProfileAsync(Guid userId, TutorProfileRequest request, CancellationToken ct)
    {
        var existing = await _tutorRepository.GetByUserIdAsync(userId, ct);
        if (existing != null) return new Result<TutorProfileResponse>.Failure("Tutor profile already exists", 409);

        return await UpsertProfileAsync(userId, request, ct);
    }

    public async Task<Result<TutorProfileResponse>> UpdateProfileAsync(Guid userId, Guid tutorProfileId, TutorProfileRequest request, CancellationToken ct)
    {
        var profile = await _tutorRepository.GetByIdAsync(tutorProfileId, ct);
        if (profile == null) return new Result<TutorProfileResponse>.Failure("Profile not found", 404);

        if (profile.UserId != userId) return new Result<TutorProfileResponse>.Failure("Unauthorized", 403);

        // Re-use upsert mapping logic by operating on the tracked entity
        profile.FullName = request.FullName;
        profile.PhotoUrl = request.PhotoUrl;
        profile.Bio = request.Bio;
        profile.Category = request.Category;
        profile.BaseLatitude = request.BaseLatitude;
        profile.BaseLongitude = request.BaseLongitude;
        profile.Postcode = request.Postcode;
        profile.TravelRadiusMiles = request.TravelRadiusMiles;
        profile.PricePerHour = request.PricePerHour;
        profile.TeachingMode = request.TeachingMode;
        profile.HasDbs = request.HasDbs;
        profile.HasCertification = request.HasCertification;
        profile.UpdatedAt = DateTime.UtcNow;

        profile.Location = _geometryFactory.CreatePoint(new Coordinate((double)request.BaseLongitude, (double)request.BaseLatitude));

        await _tutorRepository.UpdateAsync(profile, ct);
        await _tutorRepository.SaveChangesAsync(ct);

        await _tutorRepository.ReplaceSubjectsAsync(profile.Id, request.Subjects, ct);

        var slots = request.Availability.Select(a => new AvailabilitySlot
        {
            DayOfWeek = a.DayOfWeek,
            StartTime = TimeOnly.Parse(a.StartTime),
            EndTime = TimeOnly.Parse(a.EndTime)
        }).ToList();
        await _tutorRepository.ReplaceAvailabilityAsync(profile.Id, slots, ct);

        await _tutorRepository.SaveChangesAsync(ct);

        var reloaded = await _tutorRepository.GetByIdAsync(profile.Id, ct);
        return new Result<TutorProfileResponse>.Success(MapToResponse(reloaded!));
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
        profile.PhotoUrl = request.PhotoUrl;
        profile.Bio = request.Bio;
        profile.Category = request.Category;
        profile.BaseLatitude = request.BaseLatitude;
        profile.BaseLongitude = request.BaseLongitude;
        profile.Postcode = request.Postcode;
        profile.TravelRadiusMiles = request.TravelRadiusMiles;
        profile.PricePerHour = request.PricePerHour;
        profile.TeachingMode = request.TeachingMode;
        profile.HasDbs = request.HasDbs;
        profile.HasCertification = request.HasCertification;
        profile.UpdatedAt = DateTime.UtcNow;

        // Update Location Point
        profile.Location = _geometryFactory.CreatePoint(new Coordinate((double)request.BaseLongitude, (double)request.BaseLatitude));

        if (isNew)
        {
            await _tutorRepository.AddAsync(profile, ct);
        }
        else
        {
            await _tutorRepository.UpdateAsync(profile, ct);
        }

        await _tutorRepository.SaveChangesAsync(ct);

        await _tutorRepository.ReplaceSubjectsAsync(profile.Id, request.Subjects, ct);

        var slots = request.Availability.Select(a => new AvailabilitySlot
        {
            DayOfWeek = a.DayOfWeek,
            StartTime = TimeOnly.Parse(a.StartTime),
            EndTime = TimeOnly.Parse(a.EndTime)
        }).ToList();
        await _tutorRepository.ReplaceAvailabilityAsync(profile.Id, slots, ct);

        await _tutorRepository.SaveChangesAsync(ct);

        var reloaded = await _tutorRepository.GetByIdAsync(profile.Id, ct);
        return new Result<TutorProfileResponse>.Success(MapToResponse(reloaded!));
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

        // Increment view count
        profile.ViewCount++;
        await _tutorRepository.UpdateAsync(profile, ct);
        await _tutorRepository.SaveChangesAsync(ct);

        return new Result<TutorProfileResponse>.Success(MapToResponse(profile));
    }

    public async Task<Result<TutorStatsResponse>> GetStatsAsync(Guid userId, CancellationToken ct)
    {
        var profile = await _tutorRepository.GetByUserIdAsync(userId, ct);
        if (profile == null) return new Result<TutorStatsResponse>.Failure("Profile not found", 404);

        var bookingStats = await _bookingRepository.GetStatsByTutorIdAsync(profile.Id, ct);

        var stats = new TutorStatsResponse(
            TotalViews: profile.ViewCount,
            PendingBookings: bookingStats.Pending,
            ActiveBookings: bookingStats.Accepted,
            CompletedBookings: bookingStats.Completed,
            TotalEarnings: bookingStats.Earnings,
            ResponseRate: profile.ResponseRate
        );

        return new Result<TutorStatsResponse>.Success(stats);
    }

    public async Task<Result<PagedResult<TutorSearchResultDto>>> SearchAsync(TutorSearchRequest request, CancellationToken ct)
    {
        var normalizedRequest = NormalizeRequest(request);

        if (!string.IsNullOrEmpty(normalizedRequest.Postcode) && (!normalizedRequest.Lat.HasValue || !normalizedRequest.Lng.HasValue))
        {
            var coords = await _geocodingService.GeocodePostcodeAsync(normalizedRequest.Postcode, ct);
            if (coords.HasValue)
            {
                normalizedRequest = normalizedRequest with { Lat = coords.Value.Lat, Lng = coords.Value.Lng };
            }
        }

        var results = await _searchRepository.SearchAsync(normalizedRequest, ct);
        return new Result<PagedResult<TutorSearchResultDto>>.Success(results);
    }

    private static TutorSearchRequest NormalizeRequest(TutorSearchRequest request)
    {
        var radiusMiles = request.RadiusMiles <= 0 ? 10 : Math.Min(request.RadiusMiles, 50);
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 20 : Math.Min(request.PageSize, 50);
        var sort = string.IsNullOrWhiteSpace(request.SortBy) ? "best" : request.SortBy;

        int? availabilityDay = request.AvailabilityDay is >= 0 and <= 6 ? request.AvailabilityDay : null;

        return request with
        {
            RadiusMiles = radiusMiles,
            Page = page,
            PageSize = pageSize,
            SortBy = sort,
            AvailabilityDay = availabilityDay
        };
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
            profile.HasDbs,
            profile.HasCertification,
            ComputeNextAvailableText(profile.AvailabilitySlots),
            "Typically responds within a few hours",
            profile.ViewCount,
            profile.AvailabilitySlots.Select(s => new AvailabilitySlotResponse(
                s.DayOfWeek,
                s.StartTime.ToString("HH:mm"),
                s.EndTime.ToString("HH:mm")
            )).ToList()
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

