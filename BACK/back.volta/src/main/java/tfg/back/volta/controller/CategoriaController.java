package tfg.back.volta.controller;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tfg.back.volta.entidades.Categoria;
import tfg.back.volta.utils.ConfiguracionBbdd;
import tfg.back.volta.utils.JsonFileReader;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CategoriaController {

    @Autowired
    private ConfiguracionBbdd configuracion_bbdd;

    @Autowired
    private final JsonFileReader jsonFileReader;

    private CategoriaController(JsonFileReader jsonFileReader) {
        this.jsonFileReader = jsonFileReader;
    }

    final Gson gson = new Gson();

    @Value("${queries.json.file.path}")
    private String jsonQueries;

    //Metodo para obtener todas las categorías
    @GetMapping("/categoria/getAll")
    public ResponseEntity<List<Categoria>> obtenerCategorias() throws IOException {
        //Lista para almacenar las categorías
        List<Categoria> categorias = new ArrayList<>();

        // Obtención de la query que se va a utilizar para obtener la información de la BBDD
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "categoria.getall.get");

        // Obtener todas las categorías de la base de datos
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();

            // Recorrer los resultados
            while (resultSet.next()) {
                int id_categoria = resultSet.getInt("id_categoria");
                String tipo_categoria = resultSet.getString("tipo_categoria");
                int puntos = resultSet.getInt("puntos");
                boolean enabled = resultSet.getBoolean("Enabled");
                String creador_categria = resultSet.getString("creador_categoria");

                // Crear un objeto Categoría y añadirlo a la lista
                Categoria categoria = new Categoria(id_categoria, puntos, tipo_categoria, enabled,creador_categria);
                categorias.add(categoria);
            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(categorias);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }

    @PostMapping("/categoria/add")
    public ResponseEntity<Boolean> nuevaCategoria(@RequestBody List<Categoria> categorias) throws IOException, SQLException {

        PreparedStatement preparedStatementBuscar = null;
        PreparedStatement preparedStatementInsert = null;

        System.out.println(categorias);

        ResultSet resultSet = null;
        Connection connection = null;

        String queryBuscarCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "categoria.add.post.comprobar");
        String queryInsertarCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "categoria.add.post.insert");

        try{
            connection = configuracion_bbdd.getConnection();

            for (Categoria categoria: categorias) {
                preparedStatementBuscar = connection.prepareStatement(queryBuscarCategoria);
                preparedStatementBuscar.setString(1, categoria.getTipo_categoria());
                resultSet = preparedStatementBuscar.executeQuery();

                if(!resultSet.next())
                {
                    preparedStatementInsert = connection.prepareStatement(queryInsertarCategoria);
                    preparedStatementInsert.setString(1, categoria.getTipo_categoria());
                    preparedStatementInsert.setString(2, categoria.getCreador_categoria());

                    int rowsAffected = preparedStatementInsert.executeUpdate();

                    if(rowsAffected <= 0){
                        System.out.println("Problemas insertando: " + categoria);
                    }
                    else {
                        System.out.println("Categoria insertada: " + categoria);
                    }
                }
                else {
                    System.out.println("La categoria ya existe: " + categoria);
                }
            }

            return ResponseEntity.ok(true);

        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        finally {
            connection.close();
        }
    }


    @GetMapping("/categoria/getCategoriaPuntos")
    public ResponseEntity<List<Categoria>> obtenerCategoriasPuntos() throws IOException {

        // Obtención de la query que se va a utilizar para obtener la información de la BBDD
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "categoria.getcateogriapuntos.get");
        List<Categoria> categorias = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            connection = configuracion_bbdd.getConnection();

            // Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            // Ejecutar la consulta
            resultSet = preparedStatement.executeQuery();

            // Recorrer los resultados
            while (resultSet.next()) {
                int id_categoria = resultSet.getInt("id_categoria");
                String tipo_categoria = resultSet.getString("tipo_categoria");
                int puntos = resultSet.getInt("puntos");

                categorias.add(new Categoria(id_categoria, tipo_categoria, puntos));

            }
            // Devolver los usuarios en formato JSON
            return ResponseEntity.ok(categorias);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Cerrar el resultSet, preparedStatement y la conexión
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            configuracion_bbdd.closeConnection(connection);
        }
    }


}
