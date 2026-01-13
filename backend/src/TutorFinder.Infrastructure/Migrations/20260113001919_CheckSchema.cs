using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TutorFinder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CheckSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "TutorProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "TutorProfiles");
        }
    }
}
