using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
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

    public async Task<List<TutorSearchResultDto>> SearchAsync(TutorSearchRequest request, CancellationToken ct)
    {
        var query = _context.TutorProfiles
            .Include(t => t.Subjects)
            .AsNoTracking()
            .Where(t => t.IsActive);

        // Geolocation Filter
        Point? searchPoint = null;
        if (request.Lat.HasValue && request.Lng.HasValue)
        {
            searchPoint = _geometryFactory.CreatePoint(new Coordinate(request.Lng.Value, request.Lat.Value));
            
            // PostGIS Distance (meters) - 1 mile = 1609.34 meters
            double radiusMeters = request.RadiusMiles * 1609.34;
            query = query.Where(t => t.Location.Distance(searchPoint) <= radiusMeters);
        }

        // Other Filters
        if (!string.IsNullOrEmpty(request.Subject))
        {
            query = query.Where(t => t.Subjects.Any(s => s.SubjectName.ToLower().Contains(request.Subject.ToLower())));
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

        // Sorting (Simplistic for MVP)
        query = request.SortBy switch
        {
            "price" => query.OrderBy(t => t.PricePerHour),
            "rating" => query.OrderByDescending(t => t.AverageRating),
            "nearest" when searchPoint != null => query.OrderBy(t => t.Location.Distance(searchPoint)),
            _ => query.OrderByDescending(t => t.AverageRating) // Default to rating
        };

        // Paging
        var results = await query
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
                searchPoint != null ? t.Location.Distance(searchPoint) / 1609.34 : 0, // Convert to miles
                "Next available: Today" // Mocked for now
            ))
            .ToListAsync(ct);

        return results;
    }
}
