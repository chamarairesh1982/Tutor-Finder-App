using TutorFinder.Domain.Entities;

namespace TutorFinder.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
