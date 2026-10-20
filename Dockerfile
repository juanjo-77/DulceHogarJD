# Backend de Dulce Hogar JD, listo para Render (o cualquier servicio que use Docker).
# La app móvil (carpeta app/) no va aquí: se instala en el celular como APK.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS compilar
WORKDIR /src
COPY backend/DulceHogar.Api/DulceHogar.Api.csproj backend/DulceHogar.Api/
RUN dotnet restore backend/DulceHogar.Api/DulceHogar.Api.csproj
COPY backend/ backend/
RUN dotnet publish backend/DulceHogar.Api/DulceHogar.Api.csproj -c Release -o /publicado --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=compilar /publicado .
ENV ASPNETCORE_ENVIRONMENT=Production
# Render indica el puerto con la variable PORT (por defecto 10000); Program.cs la usa.
EXPOSE 10000
ENTRYPOINT ["dotnet", "DulceHogar.Api.dll"]
