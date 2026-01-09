using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TutorFinder.Application.Interfaces;
using TutorFinder.Infrastructure.Data;
using TutorFinder.Infrastructure.Repositories;
using TutorFinder.Infrastructure.Services;

namespace TutorFinder.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString,
                o =>
                {
                    o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    o.UseNetTopologySuite();
                }));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITutorRepository, TutorRepository>();
        services.AddScoped<ITutorSearchRepository, TutorSearchRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        
        services.AddHttpClient<IGeocodingService, GeocodingService>();

        return services;
    }
}
