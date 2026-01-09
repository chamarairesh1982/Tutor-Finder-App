using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorFinder.Domain.Entities;

namespace TutorFinder.Infrastructure.Data.Configurations;

public class TutorSubjectConfiguration : IEntityTypeConfiguration<TutorSubject>
{
    public void Configure(EntityTypeBuilder<TutorSubject> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.SubjectName)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(s => s.TutorProfileId);
    }
}
