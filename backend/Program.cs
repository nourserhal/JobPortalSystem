using Microsoft.EntityFrameworkCore;
using ContactApi.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<EmailService>();

// Controllers 
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
// Swagger 
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();

// CORS (very important in React) 
builder.Services.AddCors(
    options => { options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin() .AllowAnyHeader() .AllowAnyMethod());
     });

var app = builder.Build();

// Swagger 
if (app.Environment.IsDevelopment()) 
{ 
    app.UseSwagger(); 
    app.UseSwaggerUI(); 
}
app.UseHttpsRedirection();
app.UseStaticFiles();

// CORS 
app.UseCors("AllowAll");

app.UseAuthorization();

// Controllers 
app.MapControllers();

app.Run("http://0.0.0.0:5234");