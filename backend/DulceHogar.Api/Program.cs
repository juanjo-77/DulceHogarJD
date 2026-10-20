using System.Text.Json.Serialization;
using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Features;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Render (y otros servicios) dicen en qué puerto escuchar con la variable PORT.
if (Environment.GetEnvironmentVariable("PORT") is { Length: > 0 } puerto)
    builder.WebHost.UseUrls($"http://0.0.0.0:{puerto}");

// Postgres en Neon. La conexión y el PIN vienen de variables de entorno, nunca del repositorio.
builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(Conexion.Postgres(builder.Configuration)));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<Reloj>();
builder.Services.AddSingleton<IntentosPin>();
builder.Services.AddServicios();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ManejadorDeReglas>();
builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("Content-Disposition")));
builder.Services.AddOpenApi();

var app = builder.Build();
var conPin = AccesoPorPin.Configurado(app.Configuration);

using (var scope = app.Services.CreateScope())
    await Semilla.PrepararAsync(scope.ServiceProvider, app.Configuration.GetValue<bool>("Demo:Seed"));

app.UseExceptionHandler();
app.UseCors();
app.UseMiddleware<AccesoPorPin>();
app.UseDefaultFiles();
app.UseStaticFiles(); // wwwroot: versión web de la app, si se publicó ahí.

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.MapVerFotos();

var api = app.MapGroup("/api");
// No pide PIN: la app lo consulta al abrir para saber si debe mostrar la pantalla del PIN.
api.MapGet("/salud", () => new { ok = true, version = "1.1", requierePin = conPin });
api.MapEndpoints();
api.MapFallback(() => Results.NotFound());

if (File.Exists(Path.Combine(app.Environment.WebRootPath ?? "", "index.html")))
    app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
