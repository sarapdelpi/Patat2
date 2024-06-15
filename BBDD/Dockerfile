# Usa una imagen base de SQL Server
FROM mcr.microsoft.com/mssql/server:2019-latest

# Establece las variables de entorno requeridas para SQL Server
ENV SA_PASSWORD=ASDFGhiytrewq121Wsadsdf
ENV ACCEPT_EULA=Y

# Copia los scripts de inicialización a la imagen
COPY ./init-db.sh /usr/src/app/init-db.sh
# Copia los scripts de inicialización a la imagen
COPY init-db.sh .
#COPY ./bbbdd.sql /usr/src/app/bbbdd.sql
# Da permisos de ejecución al script de inicialización
#RUN chmod +x /usr/src/app/init-db.sh
EXPOSE 1433
# Ejecuta el script de inicialización cuando el contenedor se inicie
#CMD /bin/bash ./usr/src/app/init-db.sh & /opt/mssql/bin/sqlservr
