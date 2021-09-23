FROM mcr.microsoft.com/dotnet/runtime:5.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["SpigotWrapper/SpigotWrapper.csproj", "SpigotWrapper/"]
RUN dotnet restore "SpigotWrapper/SpigotWrapper.csproj"
COPY . .
WORKDIR "/src/SpigotWrapper"
RUN dotnet build "SpigotWrapper.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpigotWrapper.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpigotWrapper.dll"]
