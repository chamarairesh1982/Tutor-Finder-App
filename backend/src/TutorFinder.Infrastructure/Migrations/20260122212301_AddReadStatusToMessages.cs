using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TutorFinder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReadStatusToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "BookingMessages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "BookingMessages",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "BookingMessages");

            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "BookingMessages");
        }
    }
}
