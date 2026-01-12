using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using TutorFinder.Application.Common;
using TutorFinder.Application.Interfaces;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Infrastructure.Repositories;


public class TutorSearchRepository : ITutorSearchRepository
{
    private readonly AppDbContext _context;
    private readonly GeometryFactory _geometryFactory;

    public TutorSearchRepository(AppDbContext context)
    {
        _context = context;
        _geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public async Task<PagedResult<TutorSearchResultDto>> SearchAsync(TutorSearchRequest request, CancellationToken ct)
    {
        var radiusMiles = request.RadiusMiles <= 0 ? 10 : Math.Min(request.RadiusMiles, 50);

        var query = _context.TutorProfiles
            .Include(t => t.Subjects)
            .Include(t => t.AvailabilitySlots)
            .AsNoTracking()
            .Where(t => t.IsActive);

        Point? searchPoint = null;
        if (request.Lat.HasValue && request.Lng.HasValue)
        {
            searchPoint = _geometryFactory.CreatePoint(new Coordinate(request.Lng.Value, request.Lat.Value));
            if (radiusMiles > 0)
            {
                double radiusMeters = radiusMiles * 1609.34;
                // Include tutors missing a stored geography point to avoid filtering everything out
                query = query.Where(t => t.Location == null || t.Location.Distance(searchPoint) <= radiusMeters);
            }
        }

        if (!string.IsNullOrEmpty(request.Subject))
        {
            var subjectLower = request.Subject.ToLower();
            query = query.Where(t => t.Subjects.Any(s => s.SubjectName.ToLower().Contains(subjectLower)));
        }

        if (request.Category.HasValue)
        {
            query = query.Where(t => t.Category == request.Category.Value);
        }

        if (request.MinRating.HasValue)
        {
            query = query.Where(t => t.AverageRating >= request.MinRating.Value);
        }

        if (request.PriceMin.HasValue)
        {
            query = query.Where(t => t.PricePerHour >= request.PriceMin.Value);
        }

        if (request.PriceMax.HasValue)
        {
            query = query.Where(t => t.PricePerHour <= request.PriceMax.Value);
        }

        if (request.Mode.HasValue)
        {
            query = query.Where(t => t.TeachingMode == request.Mode.Value || t.TeachingMode == TeachingMode.Both);
        }

        if (request.AvailabilityDay.HasValue)
        {
            var day = (DayOfWeek)request.AvailabilityDay.Value;
            query = query.Where(t => t.AvailabilitySlots.Any(a => a.DayOfWeek == day));
        }

        var total = await query.CountAsync(ct);

        query = NormalizeSort(request.SortBy, query, searchPoint);

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new TutorSearchResultDto(
                t.Id,
                t.FullName,
                t.PhotoUrl,
                t.Category,
                t.Subjects.Select(s => s.SubjectName).ToList(),
                t.PricePerHour,
                t.AverageRating,
                t.ReviewCount,
                searchPoint != null
                    ? (t.Location != null ? t.Location.Distance(searchPoint) / 1609.34 : 0)
                    : 0,
                ComputeNextAvailableText(t.AvailabilitySlots),
                t.TeachingMode,
                t.HasDbs,
                t.HasCertification
            ))
            .ToListAsync(ct);

        return new PagedResult<TutorSearchResultDto>(items, total, request.Page, request.PageSize);
    }

    private static IQueryable<TutorProfile> NormalizeSort(string sortBy, IQueryable<TutorProfile> query, Point? searchPoint)
    {
        var sort = string.IsNullOrWhiteSpace(sortBy) ? "best" : sortBy.ToLowerInvariant();

        return sort switch
        {
            "pricehigh" => query.OrderByDescending(t => t.PricePerHour),
            "price" or "pricelow" => query.OrderBy(t => t.PricePerHour),
            "rating" => query.OrderByDescending(t => t.AverageRating).ThenByDescending(t => t.ReviewCount),
            "nearest" when searchPoint != null => query.OrderBy(t => t.Location.Distance(searchPoint)),
            _ => searchPoint != null
                ? query
                    .OrderByDescending(t => t.AverageRating)
                    .ThenByDescending(t => t.ReviewCount)
                    .ThenBy(t => t.PricePerHour)
                    .ThenBy(t => t.Location.Distance(searchPoint))
                : query
                    .OrderByDescending(t => t.AverageRating)
                    .ThenByDescending(t => t.ReviewCount)
                    .ThenBy(t => t.PricePerHour)
        };
    }

    private static string ComputeNextAvailableText(ICollection<AvailabilitySlot> slots)
    {
        if (slots == null || slots.Count == 0) return "Ask for availability";

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

        if (ordered == null) return "Ask for availability";

        var nextDate = now.Date.AddDays(ordered.OffsetDays);
        return ordered.OffsetDays == 0
            ? $"Next available today at {ordered.Slot.StartTime:HH:mm}"
            : $"Next available {nextDate:ddd} at {ordered.Slot.StartTime:HH:mm}";
    }
}

