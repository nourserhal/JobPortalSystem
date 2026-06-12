using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContactApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserRoleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Users",
                newName: "Skills");

            migrationBuilder.RenameColumn(
                name: "Lname",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "Fname",
                table: "Users",
                newName: "Location");

            migrationBuilder.AddColumn<string>(
                name: "CompanyLocation",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyWebsite",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CvName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HrName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyLocation",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CompanyWebsite",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CvName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "HrName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Skills",
                table: "Users",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "Lname");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Users",
                newName: "Fname");
        }
    }
}
