package tfg.back.volta.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashContrasena {
    public String hashPassword(String password) { // Método para hashear la contraseña con SHA-256

        try {
            // Crear instancia de MessageDigest para SHA-256
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            // Aplicar el algoritmo de hash a la contraseña
            byte[] hashedBytes = md.digest(password.getBytes());
            // Convertir los bytes del hash a una representación hexadecimal
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            // Devolver el hash en formato hexadecimal
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            // Manejar la excepción en caso de que el algoritmo no esté disponible
            e.printStackTrace();
            return null;
        }
    }

}
