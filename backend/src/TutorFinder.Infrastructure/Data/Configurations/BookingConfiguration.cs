using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Infrastructure.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<BookingRequest>
{
    public void Configure(EntityTypeBuilder<BookingRequest> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.PricePerHourAtBooking)
            .HasPrecision(8, 2);

        builder.HasOne(b => b.Student)
            .WithMany()
            .HasForeignKey(b => b.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Tutor)
            .WithMany()
            .HasForeignKey(b => b.TutorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Messages)
            .WithOne()
            .HasForeignKey(m => m.BookingRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(b => b.StudentId);
        builder.HasIndex(b => b.TutorId);
        builder.HasIndex(b => b.Status);

        builder.HasQueryFilter(b => !b.Student.IsDeleted && !b.Tutor.User.IsDeleted);
    }
}

public class BookingMessageConfiguration : IEntityTypeConfiguration<BookingMessage>
{
    public void Configure(EntityTypeBuilder<BookingMessage> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Content)
            .IsRequired()
            .HasMaxLength(2000);

        builder.HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(m => !m.Sender.IsDeleted);
    }
}

