using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Domain;
using backend.Domain.Users;
using backend.Services;
using FastEndpoints.Security;

DotNetEnv.Env.Load(".env.local");

var bld = WebApplication.CreateBuilder();

foreach (var keyName in new[] { "TokenSigningKey", "RefreshTokenSigningKey", "CsrfSigningKey" })
{
    if (bld.Configuration[keyName] is not { Length: >= 32 })
        throw new InvalidOperationException($"{keyName} must be configured and contain at least 32 characters.");
}

bld.Services.AddFastEndpoints();
bld.Services.SwaggerDocument();
bld.Services
   .AddAuthenticationJwtBearer(
       s => s.SigningKey = bld.Configuration["TokenSigningKey"],
       o => o.Events = new JwtBearerEvents
       {
           OnMessageReceived = context =>
           {
               context.Token = context.Request.Cookies[AuthCookies.AccessToken];
               return Task.CompletedTask;
           }
       })
   .AddAuthorization();

bld.Services.AddScoped<TokenService>();
bld.Services.AddSingleton<CsrfTokenService>();
bld.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

bld.Services.AddDbContext<VistaFlixContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

bld.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = bld.Build();
app.UseCors();
app.UseMiddleware<CsrfMiddleware>();
app.UseAuthentication()
   .UseAuthorization();
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
    app.UseSwaggerGen();

app.Run();
