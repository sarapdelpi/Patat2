#!/bin/bash

# Espera a que SQL Server inicie completamente
sleep 30s

# Ejecuta los comandos SQL para inicializar la base de datos
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'ASDFGhiytrewq121Wsadsdf' -d bbdd_tfg -i /usr/src/app/bbdd.sql


chmod +x init-db.sh
