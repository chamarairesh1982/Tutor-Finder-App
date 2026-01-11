using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TutorFinder.Api;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.IntegrationTests;

public class SqlServerWebFactory : WebApplicationFactory<Program>
{
    private const string ConnectionEnvVar = "TF_TEST_SQLSERVER_CONNECTION";

    private readonly string _connectionString;

    public SqlServerWebFactory()
    {
        var baseConnectionString = Environment.GetEnvironmentVariable(ConnectionEnvVar);

        var dbName = $"TutorFinderIntegrationTests_{Guid.NewGuid():N}";

        if (!string.IsNullOrWhiteSpace(baseConnectionString))
        {
            var builder = new SqlConnectionStringBuilder(baseConnectionString)
            {
                InitialCatalog = dbName
            };

            _connectionString = builder.ConnectionString;
            return;
        }

        // Windows dev default
        _connectionString = $"Server=(localdb)\\mssqllocaldb;Database={dbName};Trusted_Connection=True;MultipleActiveResultSets=true";
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((context, config) =>
        {
            var overrides = new Dictionary<string, string?>
            {
                ["Database:Provider"] = "SqlServer",
                ["ConnectionStrings:DefaultConnection"] = _connectionString
            };
            config.AddInMemoryCollection(overrides!);
        });

        builder.ConfigureServices(services =>
        {
            // Replace AppDbContext registration
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(_connectionString, o => o.UseNetTopologySuite()));

            // Build provider and ensure database
            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
            seeder.SeedAsync().GetAwaiter().GetResult();
        });
    }
}
