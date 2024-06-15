package tfg.back.volta.controller;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tfg.back.volta.Funciones.TransferenciaPuntos;
import tfg.back.volta.entidades.BuscarProducto;
import tfg.back.volta.entidades.Favorito;
import tfg.back.volta.entidades.Producto;
import tfg.back.volta.entidades.ProductoInfo;
import tfg.back.volta.utils.ConfiguracionBbdd;
import tfg.back.volta.utils.GestorSesiones;
import tfg.back.volta.utils.JsonFileReader;

import java.io.IOException;
import java.sql.*;
import java.util.*;

@RestController
public class ProductoController {

    @Autowired
    private ConfiguracionBbdd configuracion_bbdd;

    @Autowired
    private TransferenciaPuntos transferenciaPuntos;

    @Autowired
    private final JsonFileReader jsonFileReader;


    private ProductoController(JsonFileReader jsonFileReader) {
        this.jsonFileReader = jsonFileReader;
    }

    final Gson gson = new Gson();

    GestorSesiones gestorSesiones = new GestorSesiones();// Crear una instancia de la clase GestorSesiones


    @Value("${queries.json.file.path}")
    private String jsonQueries;


    @PostMapping(value="/producto/add/imagen") //Método para añadir un producto con imagen
    @RequestMapping(value = "/producto/add/imagen", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> addImagenProducto(@RequestPart("imagen") MultipartFile imagen,
                                                      @ModelAttribute Producto nuevoProducto) throws IOException {

        PreparedStatement preparedStatementProducto = null;
        PreparedStatement preparedStatementProductoCategoria = null;
        PreparedStatement preparedStatementCategoria = null;

        ResultSet resultSet = null;
        Connection connection = null;
        String queryInsertarProducto = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.add.post.insertarProducto");
        String queryCategoriaIdCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.add.post.categoriaIdCategoria");
        String queryProductoCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.add.post.productoCategoria");

        byte[] imagenBytes = null;
        try{
            imagenBytes = imagen.getBytes();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        try {
            connection = configuracion_bbdd.getConnection();

            //Crear el PreparedStatement para el nuevo producto
            preparedStatementProducto = connection.prepareStatement(queryInsertarProducto, Statement.RETURN_GENERATED_KEYS);
            //Establecer los parámetros para el nuevo producto
            preparedStatementProducto.setBytes(1, imagenBytes);
            preparedStatementProducto.setString(2, nuevoProducto.getNombre());
            preparedStatementProducto.setString(3, nuevoProducto.getObjeto_cambio());
            preparedStatementProducto.setString(4, nuevoProducto.getCorreo_electronico());
            preparedStatementProducto.setBoolean(5, true);

            //Ejecutar la sentencia para insertar el nuevo producto
            preparedStatementProducto.executeUpdate();

            //Obtener el id del nuevo producto
            resultSet = preparedStatementProducto.getGeneratedKeys();
            int idProductoGenerado = 0;
            if (resultSet.next()){
                idProductoGenerado = resultSet.getInt(1);
            }


            for (String categoria: nuevoProducto.getCategorias_producto()) {

                //Obtener el id de la categoria
                preparedStatementCategoria = connection.prepareStatement(queryCategoriaIdCategoria);
                preparedStatementCategoria.setString(1, categoria);
                //Ejecutar la sentencia
                resultSet = preparedStatementCategoria.executeQuery();

                if(resultSet.next())
                {
                    int id_categoria = resultSet.getInt("id_categoria");

                    preparedStatementProductoCategoria = connection.prepareStatement(queryProductoCategoria);
                    preparedStatementProductoCategoria.setInt(1, idProductoGenerado);
                    preparedStatementProductoCategoria.setInt(2, id_categoria);

                    int rowsAffected = preparedStatementProductoCategoria.executeUpdate();

                    if(rowsAffected <= 0){
                        System.out.println("Problemas insertando: " + categoria);
                    }
                }
                else
                {
                    System.out.println("No se encuentra la categoria");
                }
            }


        } catch (SQLException e){
            e.printStackTrace();
        }finally {
            //Cerrar el preparedStatement y la conexión
            try {
                if (resultSet != null) {
                    resultSet.close();
                }
                if (preparedStatementProducto != null) {
                    preparedStatementProducto.close();
                }
                if (preparedStatementProductoCategoria != null) {
                    preparedStatementProductoCategoria.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            configuracion_bbdd.closeConnection((connection));
        }

        return ResponseEntity.ok(new Producto());
    }


    @GetMapping("/producto/inicio/{correo_electronico}") //Método para enseñar los productos de la página de inicio
    public ResponseEntity<List<Producto>> obtenerProductos(@PathVariable("correo_electronico") String usuarioActivo) throws IOException {
        //Obtener los productos de la base de datos excluyendo los del usuario registrado
        //Crear la conexión
        PreparedStatement preparedStatement = null;
        Connection connection = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.inicio.get");

        // Objeto map (dict en Python) Almaceno objeto de tipo ProductoInfo (creados solo para esto)
        Map<String, ProductoInfo> map = new HashMap<>();

        try{
            connection = configuracion_bbdd.getConnection();

            //Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, usuarioActivo);
            //Ejecutar la sentencia
            resultSet = preparedStatement.executeQuery();
            //Crear una lista de productos con su info
            List<Producto> listaProductos = new ArrayList<>();
            //Recorrer los resultados
            while (resultSet.next()){
                Integer idProducto = resultSet.getInt("id_producto");
                String nombre = resultSet.getString("nombre");
                String objetoCambio = resultSet.getString("objeto_cambio");
                String tipoCategoria = resultSet.getString("tipo_categoria");
                byte[] imagen = resultSet.getBytes("imagen");
                Integer puntos = resultSet.getInt("puntos");

                // Se rellena el map
                // Comprueba si el nombre ya existe en el mapsCheck if the 'nombre' already exists in the map
                if (map.containsKey(nombre)) {
                    // Si existe, se añade el tipo_categoría a la lista existente
                    map.get(nombre).addTipoCategoria(tipoCategoria);
                } else {
                    // Si no, crea una nueva lista y añade el tipo_categoría
                    ProductoInfo productoInfo = new ProductoInfo(idProducto, objetoCambio,
                            Base64.getEncoder().encodeToString(imagen), puntos);
                    productoInfo.addTipoCategoria(tipoCategoria);
                    map.put(nombre, productoInfo);
                }
            }

            // Se recorre el map guardando objetos producto en la lista que se devuelve, ya con la lista de categorias cada producto
            for (Map.Entry<String, ProductoInfo> entry : map.entrySet()) {
                String nombre = entry.getKey();
                ProductoInfo productoInfo = entry.getValue();

                listaProductos.add(new Producto(productoInfo.getId_producto(), nombre, productoInfo.getObjetoCambio(), productoInfo.getTipoCategorias(),
                        productoInfo.getImagenBase64(), productoInfo.getPuntos()));
            }

            //Devolver los productos en formato JSON
            return ResponseEntity.ok(listaProductos);

        } catch (SQLException e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }finally {
            //Cerrar el preparedStatement y la conexión
            if (preparedStatement != null){
                try{
                    assert resultSet != null;
                    resultSet.close();
                } catch (SQLException e){
                    e.printStackTrace();
                }
            }
            if (preparedStatement != null){
                try{
                    preparedStatement.close();
                } catch (SQLException e){
                    e.printStackTrace();
                }
            }
            configuracion_bbdd.closeConnection((connection));
        }
    }


    @GetMapping("/producto/getUser/{correo_electronico}")//Método para enseñar los productos de un solo usuario
    public ResponseEntity<List<Producto>> obtenerProductosUsuario(@PathVariable("correo_electronico") String correo_electronico) throws IOException {
        // Lista para almacenar los productos del usuario
        List<Producto> productos = new ArrayList<>();

        //Obtener los productos del usuario registrado
        PreparedStatement preparedStatement = null;
        Connection connection = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.getUser.get");

        Map<String, ProductoInfo> map = new HashMap<>();

        try{
            connection = configuracion_bbdd.getConnection();

            //Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            //Estbalecer el parámetro para el correo_electronico del usuario registrado
            preparedStatement.setString(1, correo_electronico);
            //Ejecutar la sentencia
            resultSet = preparedStatement.executeQuery();

            //Recorrer los resultados y mapearlos a objetos Producto
            while (resultSet.next()) {
                Integer idProducto = resultSet.getInt("id_producto");
                String nombre = resultSet.getString("nombre");
                String objetoCambio = resultSet.getString("objeto_cambio");
                String tipoCategoria = resultSet.getString("tipo_categoria");
                byte[] imagen = resultSet.getBytes("imagen");
                Integer puntos = resultSet.getInt("puntos");



                // Se rellena el map
                // Se comprueba si existe el nombre en el map
                if (map.containsKey(nombre)) {
                    map.get(nombre).addTipoCategoria(tipoCategoria);
                } else {
                    ProductoInfo productoInfo = new ProductoInfo(idProducto, objetoCambio,
                            Base64.getEncoder().encodeToString(imagen), puntos);
                    productoInfo.addTipoCategoria(tipoCategoria);
                    map.put(nombre, productoInfo);
                }
            }

            // Se recorre el map guardando objetos producto en la lista que se devuelve, ya con la lista de categorias cada producto
            for (Map.Entry<String, ProductoInfo> entry : map.entrySet()) {
                String nombre = entry.getKey();
                ProductoInfo productoInfo = entry.getValue();

                productos.add(new Producto(productoInfo.getId_producto(), nombre, productoInfo.getObjetoCambio(), productoInfo.getTipoCategorias(),
                        productoInfo.getImagenBase64(), productoInfo.getPuntos()));
            }

            //Devolver la lista de producto en el cuerpo de la respuesta
            return ResponseEntity.ok(productos);
        } catch (SQLException e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }finally {
            //Cerrar el preparedStatement y la conexión
            try{
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
            configuracion_bbdd.closeConnection((connection));
        }

    }


    @GetMapping("/producto/{id_producto}") //Metodo para obtener un producto por su id y mostrarlo
    public ResponseEntity<Producto> obtenerProducto(@PathVariable("id_producto") int id_producto) throws IOException {
        //Obtener un producto por su id
        PreparedStatement preparedStatement = null;
        Connection connection = null;
        ResultSet resultSet = null;
        Producto producto = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.{id_producto}.get");

        Map<String, ProductoInfo> map = new HashMap<>();

        try{
            connection = configuracion_bbdd.getConnection();

            //Crear el PreparedStatement
            preparedStatement = connection.prepareStatement(sqlQuery);
            //Estbalecer el parámetro para el id_producto del producto
            preparedStatement.setInt(1, id_producto);
            //Ejecutar la sentencia
            resultSet = preparedStatement.executeQuery();

            while (resultSet.next()){
                Integer idProducto = resultSet.getInt("id_producto");
                String nombre = resultSet.getString("nombre");
                String objetoCambio = resultSet.getString("objeto_cambio");
                String tipoCategoria = resultSet.getString("tipo_categoria");
                String correoPropietario = resultSet.getString("correo_electronico");
                byte[] imagen = resultSet.getBytes("imagen");
                Integer puntos = resultSet.getInt("puntos");

                // Se rellena el map
                if (map.containsKey(nombre)) {
                    map.get(nombre).addTipoCategoria(tipoCategoria);
                } else {
                    ProductoInfo productoInfo = new ProductoInfo(idProducto, objetoCambio,
                            Base64.getEncoder().encodeToString(imagen), puntos, correoPropietario);
                    productoInfo.addTipoCategoria(tipoCategoria);
                    map.put(nombre, productoInfo);
                }
            }

            // Se recorre el map guardando objetos producto en la lista que se devuelve, ya con la lista de categorias cada producto
            for (Map.Entry<String, ProductoInfo> entry : map.entrySet()) {
                String nombre = entry.getKey();
                ProductoInfo productoInfo = entry.getValue();

                producto = new Producto(productoInfo.getId_producto(), nombre,
                        productoInfo.getObjetoCambio(), productoInfo.getTipoCategorias(),
                        productoInfo.getImagenBase64(), productoInfo.getPuntos(), productoInfo.getCorreo());
            }

        } catch (SQLException e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }finally {
            //Cerrar el preparedStatement y la conexión
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
            configuracion_bbdd.closeConnection((connection));
        }

        if (producto != null){
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }

    }


    @DeleteMapping("/producto/{id_producto}") //Método para eliminar un producto
    public ResponseEntity<Void> eliminarProducto(@PathVariable("id_producto") int id_producto) throws IOException {
        Connection connection = null;
        String deleteAssociationsSQL = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.{id_producto}.delete.associations");
        String deleteProductSQL= jsonFileReader.readQueriesJsonFile(jsonQueries,"producto.{id_producto}.delete.producto");

        try {
            connection = configuracion_bbdd.getConnection();
            // Deshabilitar autocommit para controlar la transacción manualmente
            connection.setAutoCommit(false);

            // Eliminar las asociaciones del producto en la tabla productocategoria
            try (PreparedStatement preparedStatement = connection.prepareStatement(deleteAssociationsSQL)) {
                preparedStatement.setInt(1, id_producto);
                preparedStatement.executeUpdate();
            }

            // Eliminar el producto
            try (PreparedStatement preparedStatement = connection.prepareStatement(deleteProductSQL)) {
                preparedStatement.setInt(1, id_producto);
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected == 0) {
                    // No se encontró ningún producto con el ID especificado
                    connection.rollback(); // Deshacer la transacción
                    return ResponseEntity.notFound().build();
                }
            }

            // Confirmar la transacción
            connection.commit();
        } catch (SQLException e) {
            // Si ocurre algún error, deshacer la transacción y devolver un error interno del servidor
            try {
                if (connection != null) {
                    connection.rollback();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            // Restablecer autocommit a su valor predeterminado
            try {
                if (connection != null) {
                    connection.setAutoCommit(true);
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }

        return ResponseEntity.ok().build(); // Producto eliminado correctamente
    }


    // Método para actualizar un producto (cuando se vende por medio de transferencia de puntos)
    @PutMapping("/producto/vender/{id_producto}/{correo_electronico_vendedor}/{correo_electronico_comprador}/{puntos_acordados}")
    public ResponseEntity<Boolean> venderProducto(@PathVariable("id_producto") int id_producto,
                                               @PathVariable("correo_electronico_vendedor") String correo_electronico_vendedor,
                                               @PathVariable("correo_electronico_comprador") String correo_electronico_comprador,
                                               @PathVariable("puntos_acordados") String puntos_acordados) throws IOException, SQLException {

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String productoEnabledFalse = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.quitarEnable");
        int puntosProducto = 0;

        if(puntos_acordados == null) {
            puntosProducto = transferenciaPuntos.obtenerPuntosProducto(id_producto);
        }
        else
        {
            puntosProducto = Integer.parseInt(puntos_acordados);
        }

        if(transferenciaPuntos.realizarTransferencia(correo_electronico_comprador, correo_electronico_vendedor, puntosProducto))
        {
            try{
                connection = configuracion_bbdd.getConnection();
                preparedStatement = connection.prepareStatement(productoEnabledFalse);
                preparedStatement.setInt(1, id_producto);

                if(preparedStatement.executeUpdate() > 0) //Si se ha actualizado algún registro, devolverá true
                {
                    return ResponseEntity.ok(true);
                }
                else{
                    return ResponseEntity.badRequest().build();
                }

            } catch (SQLException e){
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            } finally {
                if (connection != null) {
                    connection.close();
                }
            }
        }
        else
        {
            return ResponseEntity.badRequest().build();
        }
    }


    @PostMapping("/producto/buscar") //Método para buscar productos
    public ResponseEntity<List<Producto>> buscarProductos (@RequestBody BuscarProducto producto) throws IOException, SQLException {
    //Lista para almacenar los productos encontrados
    List<Producto> productosEncontrados = new ArrayList<>();

    String correo_electronico = gestorSesiones.crearQueryBuscarHash(producto.getHash_sesion(),
            jsonFileReader.readQueriesJsonFile(jsonQueries, "hash.get"),
            configuracion_bbdd.getConnection());


    //Validar que al menos uno de los parámetros sea diferente de null
    if (producto.getNombre_producto() == null && producto.getCategorias() == null) {
        return ResponseEntity.badRequest().build();
    }

    //Hacer la búsqueda en la base de datos según el parámetro introducido
    Connection connection = null;
    PreparedStatement preparedStatement = null;
    ResultSet resultSet = null;

    try {
        connection = configuracion_bbdd.getConnection();

        if (producto.getNombre_producto() != null && producto.getCategorias() != null) {
            System.out.println("Buscando por nombre y categoría");
            /*String sqlQueryCategoriaNombre = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.buscar.nombreycategoria.get");
            preparedStatement = connection.prepareStatement(sqlQueryCategoriaNombre);
            //Buscar por nombre y categoría
            preparedStatement.setString(1, categoria);
            preparedStatement.setString(2, nombre);
            preparedStatement.setString(3, nombre);
            preparedStatement.setString(4, categoria);*/
        } else if (producto.getCategorias() != null) {
            //Buscar por categoria
            System.out.println("Buscando por categoría");

            /*String sqlQueryCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.buscar.categoria.get");
            preparedStatement = connection.prepareStatement(sqlQueryCategoria);

            preparedStatement.setString(1, correo_electronico);

            String[] categoriasArray = producto.getCategorias().toArray(new String[0]);

            String inClause = "";
            for (int i = 0; i < categoriasArray.length; i++) {
                inClause += "?,";
            }
            inClause = inClause.substring(0, inClause.length() - 1); // remove trailing comma

            sqlQueryCategoria = sqlQueryCategoria.replace("?", inClause);

            preparedStatement = connection.prepareStatement(sqlQueryCategoria);

            preparedStatement.setString(1, correo_electronico);

            for (int i = 0; i < categoriasArray.length; i++) {
                preparedStatement.setString(i + 2, categoriasArray[i]);
            }*/



            /*String sqlQueryCategoria = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.buscar.categoria.get");
            preparedStatement = connection.prepareStatement(sqlQueryCategoria);

            preparedStatement.setString(1, correo_electronico);


            String[] categoriasArray = producto.getCategorias().toArray(new String[0]);

            for (int i = 0; i < categoriasArray.length; i++) {
                preparedStatement.setString(i + 2, categoriasArray[i]);
            }*/

        } else {
            //Buscar por nombre
            System.out.println("Buscando por nombre");
            String sqlQueryNombre = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.buscar.nombre.get");
            preparedStatement = connection.prepareStatement(sqlQueryNombre);
            preparedStatement.setString(1, producto.getNombre_producto());
            preparedStatement.setString(2, correo_electronico);
        }

        System.out.println(preparedStatement);
        resultSet = preparedStatement.executeQuery();

        //Mapear los resultados a objetos tipo Producto y añadirlos a lista
        while (resultSet.next()) {
            Integer id_producto = resultSet.getInt("id_producto");
            String nombreProducto = resultSet.getString("nombre");
            String objetoCambio = resultSet.getString("objeto_cambio");
            byte[] imagen = resultSet.getBytes("imagen");

            Producto productoEncontrado = new Producto(id_producto, nombreProducto, objetoCambio,
                    Base64.getEncoder().encodeToString(imagen));
            productosEncontrados.add(productoEncontrado);
        }
        System.out.println(productosEncontrados);
        //Devovler los productos encontrados
        return ResponseEntity.ok(productosEncontrados);


    } catch (SQLException e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().build();
    } finally {
        //Cerrar el preparedStatement y la conexión
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
        configuracion_bbdd.closeConnection((connection));
    }
}



    @GetMapping("producto/get-favoritos/{correo_electronico}") //Método para añadir a la lista de favoritos
    public ResponseEntity<List<Producto>> getAllFavoritos(@PathVariable String correo_electronico) throws IOException {

        List<Producto> listaFavoritos = new ArrayList<>();
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.favoritos.get.all");
        ResultSet resultSet = null;


        try {
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, correo_electronico);

            resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                Integer id_producto = resultSet.getInt("id_producto");
                String nombreProducto = resultSet.getString("nombre");
                String objetoCambio = resultSet.getString("objeto_cambio");
                Integer puntos = resultSet.getInt("puntos");
                byte[] imagen = resultSet.getBytes("imagen");

                Producto productoEncontrado = new Producto(id_producto, nombreProducto, objetoCambio,
                        Base64.getEncoder().encodeToString(imagen));

                listaFavoritos.add(new Producto(productoEncontrado.getId_producto(),
                        productoEncontrado.getNombre(), productoEncontrado.getObjeto_cambio(),
                        productoEncontrado.getImagenBase64(), puntos));
            }

            return ResponseEntity.ok(listaFavoritos);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            try {
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            configuracion_bbdd.closeConnection((connection));
        }
    }


    @PostMapping("producto/favoritosadd") //Método para añadir a la lista de favoritos
    public ResponseEntity<Void> addFavorito(@RequestBody Favorito favorito) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.favoritosadd.post");

        try {
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, favorito.getCorreo_electronico());
            preparedStatement.setInt(2, favorito.getId_producto());
            preparedStatement.setBoolean(3, true);//Hacer que el producto sea favorito

            if (preparedStatement.executeUpdate() > 0) { //Si se ha actualizado algún registro, devolverá true
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            try {
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            configuracion_bbdd.closeConnection((connection));
        }
    }

}
