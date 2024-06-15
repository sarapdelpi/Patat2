package tfg.back.volta.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


// Clase para la configuración de la base de datos
@Component
public class ConfiguracionBbdd {

    // Obtener las credenciales del application.properties
    @Value("${spring.datasource.driver-class-name}")
    private String driver;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;


    public Connection getConnection() throws SQLException {

        // Cargar el driver de MySQL
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        // Establecer la conexión
        return DriverManager.getConnection(url, username, password);
    }

    // Método para cerrar la conexión
    public void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
