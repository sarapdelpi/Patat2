package tfg.back.volta.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class GestorSesiones {

    // Método para generar un hash a partir del correo electrónico y el nombre del usuario
    public String generarHash(String correo, String nombre) {
        // Concatenar el correo electrónico y el nombre en un solo string
        String datosUsuario = correo + nombre;

        // Crear un codificador BCrypt para generar el hash
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Generar el hash a partir de los datos del usuario

        return encoder.encode(datosUsuario);// Devolver el hash generado
    }

    // Método para verificar si un hash coincide con los datos del usuario
    public String crearQueryBuscarHash(String hash_token, String sqlQuery, Connection connection) throws IOException, SQLException {

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String correo_electronico = "";

        try{
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, hash_token);// Establecer el parámetro (correo electrónico)
            resultSet = preparedStatement.executeQuery();// Ejecutar la consulta

            if(resultSet.next()){// Verificar si se encontró el usuario
                //Obtener el nombre del usuario
                correo_electronico = resultSet.getString("correo_electronico");
            }
        }catch (SQLException e){
            e.printStackTrace();
        }

        return correo_electronico;
    }
}
