using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContactApi.Migrations
{
    /// <inheritdoc />
    public partial class MoveUserEmailToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Applications");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Notifications");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
