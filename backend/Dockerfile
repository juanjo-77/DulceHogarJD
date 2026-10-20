# Igual que el Dockerfile de la raíz, pero para cuando en Render el "Root Directory" es backend/.
# Así el despliegue funciona con cualquiera de las dos configuraciones.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS compilar
WORKDIR /src
COPY DulceHogar.Api/DulceHogar.Api.csproj DulceHogar.Api/
RUN dotnet restore DulceHogar.Api/DulceHogar.Api.csproj
COPY . .
RUN dotnet publish DulceHogar.Api/DulceHogar.Api.csproj -c Release -o /publicado --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=compilar /publicado .
ENV ASPNETCORE_ENVIRONMENT=Production
# Render indica el puerto con la variable PORT (por defecto 10000); Program.cs la usa.
EXPOSE 10000
ENTRYPOINT ["dotnet", "DulceHogar.Api.dll"]
