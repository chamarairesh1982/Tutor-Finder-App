using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Infrastructure.Data.Configurations;

public class TutorProfileConfiguration : IEntityTypeConfiguration<TutorProfile>
{
    public void Configure(EntityTypeBuilder<TutorProfile> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.FullName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(t => t.Bio)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(t => t.Postcode)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(t => t.PricePerHour)
            .HasPrecision(8, 2);

        builder.Property(t => t.AverageRating)
            .HasPrecision(3, 2);

        builder.Property(t => t.BaseLatitude)
            .HasPrecision(9, 6);

        builder.Property(t => t.BaseLongitude)
            .HasPrecision(9, 6);

        // Geo Configuration
        builder.Property(t => t.Location)
            .HasColumnType("geography");


        // builder.HasSpatialIndex(t => t.Location);

        // Relationships
        builder.HasOne(t => t.User)
            .WithOne()
            .HasForeignKey<TutorProfile>(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);



        builder.HasMany(t => t.Subjects)
            .WithOne()
            .HasForeignKey(s => s.TutorProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.AvailabilitySlots)
            .WithOne()
            .HasForeignKey(a => a.TutorProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => t.UserId).IsUnique();
        builder.HasIndex(t => new { t.Category, t.IsActive });
    }
}
