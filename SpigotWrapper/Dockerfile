FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /src

# Copy everything
COPY ["SpigotWrapper/SpigotWrapper.csproj", "SpigotWrapper/"]
COPY ["SpigotWrapperLib/SpigotWrapperLib.csproj", "SpigotWrapperLib/"]
# Restore as distinct layers
RUN dotnet restore "SpigotWrapper/SpigotWrapper.csproj"

COPY ["SpigotWrapper/*", "SpigotWrapper/"]
COPY ["SpigotWrapperLib/*", "SpigotWrapperLib/"]
WORKDIR /src/SpigotWrapper
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /src/SpigotWrapper/out .

ARG ASPNETCORE_URLS="https://+;http://+"
ARG ASPNETCORE_HTTPS_PORT=443
ARG ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx

ENV ASPNETCORE_URLS=$ASPNETCORE_URLS
ENV ASPNETCORE_HTTPS_PORT=$ASPNETCORE_HTTPS_PORT
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=$ASPNETCORE_Kestrel__Certificates__Default__Path

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "SpigotWrapper.dll"]