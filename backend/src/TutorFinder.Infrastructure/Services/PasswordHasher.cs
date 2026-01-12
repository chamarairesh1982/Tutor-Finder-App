using TutorFinder.Application.Interfaces;
using BCrypt.Net;

namespace TutorFinder.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12; // AGENTS.md requires work factor 12 for BCrypt

    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
