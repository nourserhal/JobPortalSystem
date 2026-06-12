using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContactApi.Migrations
{
    /// <inheritdoc />
    public partial class AddRequestedCategoryToJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestedCategory",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestedCategory",
                table: "Jobs");
        }
    }
}
