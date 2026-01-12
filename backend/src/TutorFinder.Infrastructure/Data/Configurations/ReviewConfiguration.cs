using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Infrastructure.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Comment)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasOne(r => r.BookingRequest)
            .WithOne(b => b.Review)
            .HasForeignKey<Review>(r => r.BookingRequestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Student)
            .WithMany()
            .HasForeignKey(r => r.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Tutor)
            .WithMany()
            .HasForeignKey(r => r.TutorProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => r.TutorProfileId);
        builder.HasIndex(r => r.StudentId);

        builder.HasQueryFilter(r => !r.Student.IsDeleted && !r.Tutor.User.IsDeleted);
    }
}
