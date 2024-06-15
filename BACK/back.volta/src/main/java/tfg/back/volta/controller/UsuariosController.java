package tfg.back.volta.controller;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.back.volta.entidades.Token;
import tfg.back.volta.entidades.Usuario;
import tfg.back.volta.utils.ConfiguracionBbdd;
import tfg.back.volta.utils.GestorSesiones;
import tfg.back.volta.utils.HashContrasena;
import tfg.back.volta.utils.JsonFileReader;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UsuariosController {// Clase para el controlador de los usuarios (altas y logins)

    @Autowired
    private ConfiguracionBbdd configuracion_bbdd;

    @Autowired
    private final JsonFileReader jsonFileReader;

    @Autowired
    private HttpServletRequest request; // Para crear la sesión


    private UsuariosController(JsonFileReader jsonFileReader) {
        this.jsonFileReader = jsonFileReader;
    }

    final Gson gson = new Gson();

    @Value("${queries.json.file.path}")
    private String jsonQueries;

    HashContrasena hashContrasena = new HashContrasena();// Crear una instancia de la clase HashContrasena
    GestorSesiones gestorSesiones = new GestorSesiones();// Crear una instancia de la clase GestorSesiones



    @PostMapping("/usuario/add")// Método para crear un nuevo usuario tipo persona
    public ResponseEntity<Token> crearUsuarioPersona(@RequestBody Usuario nuevoUsuario) throws IOException {
        // Insertar el nuevo usuario en la base de datos
        // Crear la conexión
        PreparedStatement preparedStatement = null;
        PreparedStatement preparedStatementSession = null;
        Connection connection = null;
        String sqlQuery = "";
        String sqlQuerySession = "";
        String sessionId= gestorSesiones.generarHash(nuevoUsuario.getCorreo_electronico(), nuevoUsuario.getNombre());

        if(nuevoUsuario.getId_tipo_usuario() == 1)
        {
            sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.add.post.persona") ;
            // Crear una sesión para el usuario persona
            sqlQuerySession = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.add.post.persona.withsession") ;

        }
        else
        {
            sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.add.post.institucion");
            // Crear una sesión para el usuario institución
            sqlQuerySession = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.add.post.persona.withsession") ;

        }

        System.out.println(sqlQuery);
        System.out.println(nuevoUsuario.getContrasena());
        try{
           connection = configuracion_bbdd.getConnection();

           // Crear el PreparedStatement
           preparedStatement = connection.prepareStatement(sqlQuery);
           preparedStatementSession = connection.prepareStatement(sqlQuerySession);
           // Establecer los parámetros
           preparedStatement.setString(1, nuevoUsuario.getCorreo_electronico());
           preparedStatement.setString(2, nuevoUsuario.getNombre());
           preparedStatement.setInt(3, nuevoUsuario.getTelefono());

           // Hashear la contraseña y guardarla en al BBDD
           preparedStatement.setString(4, hashContrasena.hashPassword(nuevoUsuario.getContrasena()));

           preparedStatement.setInt(5, nuevoUsuario.getCodigo_postal());
           preparedStatement.setInt(6, nuevoUsuario.getId_tipo_usuario());
           preparedStatement.setInt(7, nuevoUsuario.getCredito());

            // Establecer los parámetros
            preparedStatementSession.setString(1, sessionId);
            preparedStatementSession.setString(2, nuevoUsuario.getCorreo_electronico());


            System.out.println(preparedStatement);
           // Ejecutar la sentencia
           preparedStatement.executeUpdate();
           preparedStatementSession.executeUpdate();
       } catch (SQLException e) {
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

        return ResponseEntity.ok(new Token(sessionId,nuevoUsuario.getId_tipo_usuario()));
    }


    @PostMapping("/usuario/login")// Método para hacer login
    public ResponseEntity<Token> Login(@RequestBody Usuario usuario) throws IOException {

        // Comprobar si el usuario existe en la base de datos y las credenciales son válidas
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        PreparedStatement preparedStatementSession = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.login.post") ;
        String sessionIdlogin = gestorSesiones.generarHash(usuario.getCorreo_electronico(), usuario.getNombre());
        String sqlQuerySession= jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.add.post.persona.withsession") ;

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatementSession = connection.prepareStatement(sqlQuerySession);

            // Establecer el parámetro (correo electrónico)
            preparedStatement.setString(1, usuario.getCorreo_electronico());
            System.out.println(sessionIdlogin);
            preparedStatementSession.setString(1,sessionIdlogin);
            preparedStatementSession.setString(2,usuario.getCorreo_electronico());

            // Ejecutar la consulta
            System.out.println(sqlQuery);
            System.out.println(sqlQuerySession);
            System.out.println(usuario.getId_tipo_usuario());
            resultSet = preparedStatement.executeQuery();
            //preparedStatementSession.executeUpdate();
            // Verificar si se encontró el usuario
            if (!resultSet.next()) {
                // El usuario no existe
                System.out.println("Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Token());
            }
            // Verificar la contraseña
            String hashedPassword = hashContrasena.hashPassword(usuario.getContrasena());
            if (!resultSet.getString("contrasena").equals(hashedPassword)) {
                // Las contraseñas no coinciden
                System.out.println("Las contraseñas no coinciden");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Token());
            }

            //Obtener el id_tipo_usuario
            int idTipoUsuario = resultSet.getInt("id_tipo_usuario");

            // El usuario y la contraseña son válidos
            //Crear una sesión para el usuario
            HttpSession session = request.getSession(true);
            session.setAttribute("usuarioActivo", usuario.getCorreo_electronico());

            //Guardar la sesión en la base de datos
            preparedStatementSession.executeUpdate();

            return ResponseEntity.ok(new Token(sessionIdlogin,idTipoUsuario));

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Token());
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
            if (preparedStatementSession != null) {
                try {
                    preparedStatementSession.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }


    @PostMapping ("/usuario/logout")// Método para cerrar sesión
    public ResponseEntity<Token> logout(@RequestParam String sessionId) throws IOException, SQLException {

        String correo_electronico = gestorSesiones.crearQueryBuscarHash(sessionId,
                jsonFileReader.readQueriesJsonFile(jsonQueries, "hash.get"),
                configuracion_bbdd.getConnection());

        if(correo_electronico.equals(""))
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new Token("Sesión no encontrada", 0));
        }
        else
        {
            //Verificar que sessionId y correoElectronico no sean nulos
            if (sessionId == null ) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Token("Datos de sesión incorrectos", 0));
            }
            //Eliminar el hash y el correo electrónico de la tabla sesiones
            String sessionDeleteQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.logout.post.withsession") ;
            // Crear la conexión
            try(Connection connection = configuracion_bbdd.getConnection();
                PreparedStatement sessionDeleteStatement = connection.prepareStatement(sessionDeleteQuery)){
                sessionDeleteStatement.setString(1, sessionId);// Establecer el parámetro (hash de la sesión)
                int lineasAfectadas = sessionDeleteStatement.executeUpdate();

                if(lineasAfectadas>0) {
                    return ResponseEntity.ok(new Token("Sesión cerrada", 0));
                }else{
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Token("Sesión no encontrada", 0));
                }

            }catch (SQLException e){
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Token("Error de base de datos", 0));
            }
        }
    }


    @GetMapping("/usuario/institucion/getAll") // Método para obtener todos los nombres de las instituciones
    public ResponseEntity<List<Usuario>> obtenerInstituciones() throws IOException {
        // Obtener todos los usuarios de la base de datos
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.institucion.getall.get");

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();
            // Crear una lista de usuarios
            List<Usuario> usuarios = new ArrayList<>();
            // Recorrer los resultados
            while (resultSet.next()) {
                usuarios.add(new Usuario(resultSet.getString("nombre")));// Añadir el nombre del usuario a la lista
            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(usuarios);
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


    //Método para obtener el nombre, correo, teléfono y codigo postal de las instituciones
    @GetMapping("/usuario/institucion/getInfo")
    public ResponseEntity<List<Usuario>> obtenerInforInstituciones() throws IOException{

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.infoinstitucion.get");

        try{
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();
            // Crear una lista de usuarios
            List<Usuario> usuarios = new ArrayList<>();
            // Recorrer los resultados
            while(resultSet.next()){
                Usuario usuario = new Usuario();
                usuario.setNombre(resultSet.getString("nombre"));
                usuario.setCorreo_electronico(resultSet.getString("correo_electronico"));
                usuario.setTelefono(resultSet.getInt("telefono"));
                usuario.setCodigo_postal(resultSet.getInt("codigo_postal"));
                usuarios.add(usuario);
            }

            //Devolver los usuarios en formato JSON
            return ResponseEntity.ok(usuarios);
        }catch(SQLException e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }finally{
            // Cerrar el resultSet, preparedStatement y la conexión
            if(resultSet != null){
                try{
                    resultSet.close();
                }catch(SQLException e){
                    e.printStackTrace();
                }
            }
            if(preparedStatement != null){
                try{
                    preparedStatement.close();
                }catch(SQLException e){
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }

    //Método para obtener el nombre del usuario que ha inciado sesión
    @GetMapping("/usuario/getUserInfo")
    public ResponseEntity<Usuario> obtenerNombreUsuarioPuntos(@RequestParam String sessionId) throws SQLException, IOException {

        String correo_electronico = gestorSesiones.crearQueryBuscarHash(sessionId,
                jsonFileReader.readQueriesJsonFile(jsonQueries, "hash.get"),
                configuracion_bbdd.getConnection());

        if(correo_electronico.equals(""))
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Usuario("", 0));
        }
        else {
            String queryNombre = jsonFileReader.readQueriesJsonFile(jsonQueries, "usuario.getUserInfo.get");
            String nombreUsuario = "";
            Integer credito = 0;


            PreparedStatement preparedStatement = null;
            ResultSet resultSet = null;
            Connection connection = null;

            try{
                connection = configuracion_bbdd.getConnection();
                preparedStatement = connection.prepareStatement(queryNombre);
                preparedStatement.setString(1, correo_electronico);// Establecer el parámetro (correo electrónico)
                resultSet = preparedStatement.executeQuery();// Ejecutar la consulta

                if(resultSet.next()){// Verificar si se encontró el usuario
                    //Obtener el nombre del usuario
                    nombreUsuario = resultSet.getString("nombre");
                    credito = resultSet.getInt("credito");
                }
            }
            catch (SQLException e){
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Usuario(nombreUsuario, credito));
            }
            finally {
                configuracion_bbdd.closeConnection(connection);

            }
            return ResponseEntity.ok(new Usuario(nombreUsuario, credito));
        }

    }
}
