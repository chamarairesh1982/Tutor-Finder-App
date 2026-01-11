using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using TutorFinder.Application.Interfaces;
using TutorFinder.Infrastructure.Data;
using TutorFinder.Infrastructure.Repositories;
using TutorFinder.Infrastructure.Services;

namespace TutorFinder.Infrastructure;


public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var provider = configuration.GetValue<string>("Database:Provider") ?? "Postgres";
        var postgresConnection = configuration.GetConnectionString("Postgres");
        var sqlConnection = configuration.GetConnectionString("DefaultConnection");

        if (provider.Equals("Postgres", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(postgresConnection))
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(postgresConnection, o =>
                {
                    o.UseNetTopologySuite();
                }));
        }
        else if (!string.IsNullOrWhiteSpace(sqlConnection))
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(sqlConnection,
                    o =>
                    {
                        o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                        o.UseNetTopologySuite();
                    }));
        }
        else
        {
            throw new InvalidOperationException("No valid connection string configured. Set ConnectionStrings:Postgres or DefaultConnection.");
        }

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITutorRepository, TutorRepository>();
        services.AddScoped<ITutorSearchRepository, TutorSearchRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<DbSeeder>();
        
        services.AddHttpClient<IGeocodingService, GeocodingService>();

        return services;
    }
}


