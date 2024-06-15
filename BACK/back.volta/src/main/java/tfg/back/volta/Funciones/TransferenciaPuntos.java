package tfg.back.volta.Funciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tfg.back.volta.utils.ConfiguracionBbdd;
import tfg.back.volta.utils.JsonFileReader;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class TransferenciaPuntos {

    @Autowired
    private ConfiguracionBbdd configuracion_bbdd;

    @Autowired
    private JsonFileReader jsonFileReader;

    private TransferenciaPuntos(JsonFileReader jsonFileReader) {
        this.jsonFileReader = jsonFileReader;
    }

    @Value("${queries.json.file.path}")
    private String jsonQueries;



    public TransferenciaPuntos(ConfiguracionBbdd configuracion_bbdd) {
        this.configuracion_bbdd = configuracion_bbdd;
    }

    public TransferenciaPuntos(){}

    public boolean realizarTransferencia (String correoComprador, String correoVendedor, int puntos) throws IOException {
        //Comprobar si los correos existen en la base de datos y tienen suficientes puntos
        //para la transferencia;

        if (existeUsuario (correoComprador) && existeUsuario(correoVendedor)){
            int puntosComprador = obtenerPuntosUsuario(correoComprador);
            if(puntosComprador >= puntos){
                System.out.println("Puntos comprador: " + puntosComprador);
                //Realizar la transferencia
                if(restarPuntosUsuario(correoComprador, puntos) && sumarPuntosUsuario(correoVendedor, puntos)){
                    return true; //Transferencia realizada con éxito
                }

            }
        }
        return false; //Transferencia no realizada
    }

    private boolean existeUsuario(String correo) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.existeUsuario");

        try{
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, correo);
            resultSet = preparedStatement.executeQuery();
            return  resultSet.next(); //Si existe el usuario, devolverá true
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            cerrarRecursos(resultSet, preparedStatement, connection);
        }

    }


    private int obtenerPuntosUsuario (String correo) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.obtenerPuntosUsuario");

        try{
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setString(1, correo);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()){
                return resultSet.getInt("credito");
            }
        } catch (SQLException e){
            e.printStackTrace();
        } finally {
            cerrarRecursos(resultSet, preparedStatement, connection);
        }
        return 0;
    }


    private boolean restarPuntosUsuario (String corrreo, int puntos) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.restarPuntosUsuario");

        try{
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setInt(1, puntos);
            preparedStatement.setString(2, corrreo);
            return preparedStatement.executeUpdate() > 0; //Si se ha actualizado algún registro, devolverá true
        } catch (SQLException e){
            e.printStackTrace();
            return false;
        } finally {
            cerrarRecursos(null, preparedStatement, connection);
        }
    }


    private boolean sumarPuntosUsuario (String correo, int puntos) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.sumarPuntosUsuario");

        try{
            connection = configuracion_bbdd.getConnection();
            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setInt(1, puntos);
            preparedStatement.setString(2, correo);
            return preparedStatement.executeUpdate() > 0; //Si se ha actualizado algún registro, devolverá true
        } catch (SQLException e){
            e.printStackTrace();
            return false;
        } finally {
            cerrarRecursos(null, preparedStatement, connection);
        }
    }


    private void cerrarRecursos(ResultSet resultSet, PreparedStatement preparedStatement, Connection connection) {
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
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public int obtenerPuntosProducto(int id_producto) throws IOException {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        String sqlQuery = jsonFileReader.readQueriesJsonFile(jsonQueries, "producto.vender.put.obtenerPuntos");

        try{
            connection = configuracion_bbdd.getConnection();

            preparedStatement = connection.prepareStatement(sqlQuery);
            preparedStatement.setInt(1, id_producto);
            resultSet = preparedStatement.executeQuery();

            resultSet.next();

            return resultSet.getInt("puntos");
        } catch (SQLException e){
            e.printStackTrace();
            return 0;
        } finally {
            cerrarRecursos(null, preparedStatement, connection);
        }
    }

}
