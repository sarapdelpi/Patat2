package tfg.back.volta.entidades;

public class Token {

    //variables
    private String token;
    private int id_tipo_usuario;

    //Constructores
    public Token() {
    }

    public Token(String token, int id_tipo_usuario) {
        this.token = token;
        this.id_tipo_usuario = id_tipo_usuario;
    }

    //Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getId_tipo_usuario() {
        return id_tipo_usuario;
    }

    public void setId_tipo_usuario(int id_tipo_usuario) {
        this.id_tipo_usuario = id_tipo_usuario;
    }

    //Método toString

}
