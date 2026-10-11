using FastEndpoints;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using backend.Domain;
using Npgsql;

DotNetEnv.Env.Load();

var bld = WebApplication.CreateBuilder();
bld.Services.AddFastEndpoints();

bld.Services.AddDbContext<VistaFlixContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

var app = bld.Build();
app.UseFastEndpoints();
app.Run();