package tfg.back.volta.controller;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.back.volta.entidades.Chat;
import tfg.back.volta.entidades.Mensaje;
import tfg.back.volta.entidades.UsuarioMensaje;
import tfg.back.volta.utils.ConfiguracionBbdd;
import tfg.back.volta.utils.JsonFileReader;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ConfiguracionBbdd configuracion_bbdd;

    @Autowired
    private final JsonFileReader jsonFileReader;

    public ChatController(JsonFileReader jsonFileReader) {
        this.jsonFileReader = jsonFileReader;
    }

    final Gson gson = new Gson();

    @Value("${queries.json.file.path}")
    private String jsonQueries;


    @PostMapping("/mensaje/add")
    public ResponseEntity<Mensaje> enviarMensaje(@RequestBody Mensaje nuevoMensaje) throws IOException {

        PreparedStatement preparedStatement;
        preparedStatement = null;
        Connection connection = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "mensaje.add.post");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try{
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);

            // Establecer los parámetros
            preparedStatement.setString(1, nuevoMensaje.getId_emisor());
            preparedStatement.setString(2, nuevoMensaje.getId_receptor());
            preparedStatement.setString(3, nuevoMensaje.getContenido());

            java.util.Date fechaEnvioUtil = sdf.parse(sdf.format(nuevoMensaje.getFecha_envio()));
            java.sql.Timestamp fechaEnvioSql = new java.sql.Timestamp(fechaEnvioUtil.getTime());
            preparedStatement.setTimestamp(4, fechaEnvioSql);
            preparedStatement.setBoolean(5, nuevoMensaje.isLeido());

            // Ejecutar la sentencia
            preparedStatement.executeUpdate();
            return ResponseEntity.ok(nuevoMensaje);
        } catch (SQLException | ParseException e) {
            e.printStackTrace();
        } finally {
            // Cerrar el preparedStatement y la conexión
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    System.out.println("Error al cerrar el preparedStatement.");
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }

        return ResponseEntity.ok(nuevoMensaje);
    }


    @GetMapping("/mensaje/ver/{id_mensaje}")
    public ResponseEntity<Mensaje> verMensaje(@PathVariable("id_mensaje") int id_mensaje) throws IOException {

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "mensaje.ver.get");

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setInt(1, id_mensaje);
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();
            // Crear una lista de usuarios
            List<Mensaje> mensajes = new ArrayList<>();
            // Recorrer los resultados
            while (resultSet.next()) {
                mensajes.add(new Mensaje(resultSet.getInt("id_mensaje"),
                        resultSet.getString("id_emisor"),
                        resultSet.getString("id_receptor"),
                        resultSet.getString("contenido"),
                        resultSet.getDate("fecha_envio"),
                        resultSet.getBoolean("leido")));// Añadir el nombre del usuario a la lista
            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(mensajes.get(0));
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }


    @PostMapping("/mensaje/verAll")
    public ResponseEntity<List<Mensaje>> verMensajes(@RequestBody UsuarioMensaje usuarioMensaje) throws IOException {

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "mensaje.verAll.get");

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, usuarioMensaje.getUsuario1());
            preparedStatement.setString(2, usuarioMensaje.getUsuario2());
            preparedStatement.setString(3, usuarioMensaje.getUsuario2());
            preparedStatement.setString(4, usuarioMensaje.getUsuario1());
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();
            // Crear una lista de usuarios
            List<Mensaje> mensajes = new ArrayList<>();
            // Recorrer los resultados
            while (resultSet.next()) {
                mensajes.add(new Mensaje(resultSet.getInt("id_mensaje"),
                        resultSet.getString("id_emisor"),
                        resultSet.getString("id_receptor"),
                        resultSet.getString("contenido"),
                        resultSet.getDate("fecha_envio"),
                        resultSet.getBoolean("leido")));// Añadir el nombre del usuario a la lista
            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(mensajes);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }

    @GetMapping("/mensaje/verChats/{correo_usuario}")
    public ResponseEntity<List<Chat>> getAllChats(@PathVariable("correo_usuario") String correo_usuario) throws IOException {

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "chat.verAll.get");

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, correo_usuario);
            preparedStatement.setString(2, correo_usuario);

            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();
            // Crear una lista de usuarios
            List<Chat> chats = new ArrayList<>();
            // Recorrer los resultados
            while (resultSet.next()) {
                chats.add(new Chat(resultSet.getString("nombre"),
                        resultSet.getInt("num_no_leidos"),
                        resultSet.getString("id_emisor")));// Añadir el nombre del usuario a la lista
            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(chats);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }


    @PutMapping("/mensaje/marcarLeidos/{correo_usuario}")
    public ResponseEntity<Boolean> marcarLeidos(@PathVariable("correo_usuario") String correo_usuario) throws IOException {

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "chat.marcarLeido.put");

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, correo_usuario);

            // Ejecutar la consulta
            ;
            // Crear una lista de usuarios

            if(preparedStatement.executeUpdate() > 0){
                return ResponseEntity.ok(true);
            }
            else {
                return ResponseEntity.ok(false);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }

}
