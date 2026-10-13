using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using backend.Domain;
DotNetEnv.Env.Load();

var bld = WebApplication.CreateBuilder();
bld.Services.AddFastEndpoints();

bld.Services.AddDbContext<VistaFlixContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

var app = bld.Build();
app.UseFastEndpoints();
app.UseSwaggerGen();
//app.UseSwaggerUi();
app.Run();