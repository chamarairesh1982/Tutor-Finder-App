using System.Reflection;
using Xunit;
using Microsoft.AspNetCore.Mvc;

namespace TutorFinder.ArchitectureTests;

public class ArchitectureTests
{
    private static readonly Assembly DomainAssembly = typeof(TutorFinder.Domain.Entities.User).Assembly;
    private static readonly Assembly ApplicationAssembly = typeof(TutorFinder.Application.DependencyInjection).Assembly;
    private static readonly Assembly InfrastructureAssembly = typeof(TutorFinder.Infrastructure.DependencyInjection).Assembly;
    // Use a known type in a namespace to locate the assembly
    private static readonly Assembly ApiAssembly = typeof(TutorFinder.Api.Middleware.ExceptionHandlingMiddleware).Assembly;

    [Fact]
    public void Domain_Should_Not_Depend_On_Application_Infrastructure_Or_Api()
    {
        var references = DomainAssembly.GetReferencedAssemblies();

        Assert.DoesNotContain(references, r => r.Name == ApplicationAssembly.GetName().Name);
        Assert.DoesNotContain(references, r => r.Name == InfrastructureAssembly.GetName().Name);
        Assert.DoesNotContain(references, r => r.Name == ApiAssembly.GetName().Name);
    }

    [Fact]
    public void Application_Should_Not_Depend_On_Infrastructure_Or_Api()
    {
        var references = ApplicationAssembly.GetReferencedAssemblies();

        Assert.DoesNotContain(references, r => r.Name == InfrastructureAssembly.GetName().Name);
        Assert.DoesNotContain(references, r => r.Name == ApiAssembly.GetName().Name);
    }

    [Fact]
    public void Infrastructure_Should_Not_Depend_On_Api()
    {
        var references = InfrastructureAssembly.GetReferencedAssemblies();

        Assert.DoesNotContain(references, r => r.Name == ApiAssembly.GetName().Name);
    }
    
    [Fact]
    public void Infrastructure_Should_Depend_On_Application_And_Domain()
    {
        var references = InfrastructureAssembly.GetReferencedAssemblies();

        Assert.Contains(references, r => r.Name == ApplicationAssembly.GetName().Name);
        Assert.Contains(references, r => r.Name == DomainAssembly.GetName().Name);
    }

    // Optional: Check Check Controller Inheritance
    [Fact]
    public void Controllers_Should_Inherit_From_ControllerBase()
    {
        var controllerTypes = ApiAssembly.GetTypes()
            .Where(t => t.Name.EndsWith("Controller") && !t.IsAbstract)
            .ToList();

        foreach (var controller in controllerTypes)
        {
            Assert.True(typeof(ControllerBase).IsAssignableFrom(controller), 
                $"Controller {controller.Name} should inherit from ControllerBase");
        }
    }
}
