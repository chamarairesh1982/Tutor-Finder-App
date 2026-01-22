using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TutorFinder.Application.Interfaces;
using TutorFinder.Application.Services;
using System.Reflection;

namespace TutorFinder.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddValidatorsFromAssembly(assembly);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITutorService, TutorService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFavoriteService, FavoriteService>();
        services.AddScoped<IPaymentService, PaymentService>();
        
        return services;
    }
}

