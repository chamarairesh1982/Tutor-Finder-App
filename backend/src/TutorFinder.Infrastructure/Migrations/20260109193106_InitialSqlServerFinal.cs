using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace TutorFinder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialSqlServerFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TutorProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    BaseLatitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BaseLongitude = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    TravelRadiusMiles = table.Column<int>(type: "int", nullable: false),
                    PricePerHour = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    TeachingMode = table.Column<int>(type: "int", nullable: false),
                    HasDbs = table.Column<bool>(type: "bit", nullable: false),
                    HasCertification = table.Column<bool>(type: "bit", nullable: false),
                    AverageRating = table.Column<decimal>(type: "decimal(3,2)", precision: 3, scale: 2, nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    ResponseRate = table.Column<double>(type: "float", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AvailabilitySlots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TutorProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailabilitySlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AvailabilitySlots_TutorProfiles_TutorProfileId",
                        column: x => x.TutorProfileId,
                        principalTable: "TutorProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TutorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PreferredMode = table.Column<int>(type: "int", nullable: false),
                    PreferredDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PricePerHourAtBooking = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingRequests_TutorProfiles_TutorId",
                        column: x => x.TutorId,
                        principalTable: "TutorProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookingRequests_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TutorSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TutorProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorSubjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorSubjects_TutorProfiles_TutorProfileId",
                        column: x => x.TutorProfileId,
                        principalTable: "TutorProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingMessages_BookingRequests_BookingRequestId",
                        column: x => x.BookingRequestId,
                        principalTable: "BookingRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingMessages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TutorProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_BookingRequests_BookingRequestId",
                        column: x => x.BookingRequestId,
                        principalTable: "BookingRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_TutorProfiles_TutorProfileId",
                        column: x => x.TutorProfileId,
                        principalTable: "TutorProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AvailabilitySlots_TutorProfileId",
                table: "AvailabilitySlots",
                column: "TutorProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingMessages_BookingRequestId",
                table: "BookingMessages",
                column: "BookingRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingMessages_SenderId",
                table: "BookingMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingRequests_Status",
                table: "BookingRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_BookingRequests_StudentId",
                table: "BookingRequests",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingRequests_TutorId",
                table: "BookingRequests",
                column: "TutorId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_BookingRequestId",
                table: "Reviews",
                column: "BookingRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_StudentId",
                table: "Reviews",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_TutorProfileId",
                table: "Reviews",
                column: "TutorProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorProfiles_Category_IsActive",
                table: "TutorProfiles",
                columns: new[] { "Category", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_TutorProfiles_UserId",
                table: "TutorProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjects_TutorProfileId",
                table: "TutorSubjects",
                column: "TutorProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailabilitySlots");

            migrationBuilder.DropTable(
                name: "BookingMessages");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "TutorSubjects");

            migrationBuilder.DropTable(
                name: "BookingRequests");

            migrationBuilder.DropTable(
                name: "TutorProfiles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
