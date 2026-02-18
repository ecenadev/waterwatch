using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WaterWatch.Migrations
{
    public partial class NewTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_WaterConsumption",
                table: "WaterConsumption");

            migrationBuilder.RenameTable(
                name: "WaterConsumption",
                newName: "Consumptions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Consumptions",
                table: "Consumptions",
                column: "id");

            migrationBuilder.CreateTable(
                name: "Line",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    description = table.Column<string>(type: "text", nullable: false),
                    coordinates = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Line", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Point",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    description = table.Column<string>(type: "text", nullable: false),
                    coordinates = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Point", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Line");

            migrationBuilder.DropTable(
                name: "Point");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Consumptions",
                table: "Consumptions");

            migrationBuilder.RenameTable(
                name: "Consumptions",
                newName: "WaterConsumption");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WaterConsumption",
                table: "WaterConsumption",
                column: "id");
        }
    }
}
