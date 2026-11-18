FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend.csproj ./
RUN dotnet restore backend.csproj
COPY . .
RUN dotnet publish backend.csproj --configuration Release --no-restore --output /app/publish /p:UseAppHost=false

FROM build AS migrations-build
# EF Core starts Program.cs to find the DbContext; these placeholders are never used at runtime.
ENV TokenSigningKey=build-time-placeholder-not-used-at-runtime \
    RefreshTokenSigningKey=build-time-placeholder-not-used-at-runtime \
    CsrfSigningKey=build-time-placeholder-not-used-at-runtime
RUN dotnet tool install --tool-path /tools dotnet-ef --version 10.0.12 \
    && /tools/dotnet-ef migrations bundle --configuration Release --output /app/efbundle --force

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS migrator
WORKDIR /app
COPY --from=migrations-build /app/efbundle ./efbundle
ENV DOTNET_BUNDLE_EXTRACT_BASE_DIR=/tmp/efbundle
USER app
ENTRYPOINT ["sh", "-c", "exec ./efbundle --connection \"$ConnectionStrings__DefaultConnection\""]

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER app
ENTRYPOINT ["dotnet", "backend.dll"]
