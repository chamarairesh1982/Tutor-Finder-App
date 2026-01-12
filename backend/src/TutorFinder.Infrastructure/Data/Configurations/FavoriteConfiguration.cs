using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Infrastructure.Data.Configurations;

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> builder)
    {
        builder.ToTable("Favorites");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.UserId)
            .IsRequired();

        builder.Property(f => f.TutorProfileId)
            .IsRequired();

        builder.Property(f => f.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(f => f.User)
            .WithMany()
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(f => f.TutorProfile)
            .WithMany()
            .HasForeignKey(f => f.TutorProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        // Unique constraint: One favorite per user per tutor
        builder.HasIndex(f => new { f.UserId, f.TutorProfileId })
            .IsUnique()
            .HasDatabaseName("IX_Favorites_UserId_TutorProfileId");

        // Index for fast lookup of user's favorites
        builder.HasIndex(f => f.UserId)
            .HasDatabaseName("IX_Favorites_UserId");
    }
}
