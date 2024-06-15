package tfg.back.volta.entidades;

public class Usuario {

    //Variables
    private String correo_electronico;
    private String nombre;
    private int telefono;
    private String contrasena;
    private int Codigo_postal;
    private int id_tipo_usuario;
    private int credito;

    //Constructores
    public Usuario() {
    }

    public Usuario(String nombre) {
        this.nombre = nombre;
    }

    public Usuario(String nombre, Integer credito) {

        this.nombre = nombre;
        this.credito = credito;
    }

    public Usuario(String correo_electronico, String nombre, int telefono, String contrasena, int codigo_postal, int id_tipo_usuario, int credito) {
        this.correo_electronico = correo_electronico;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contrasena = contrasena;
        Codigo_postal = codigo_postal;
        this.id_tipo_usuario = id_tipo_usuario;
        this.credito = credito;
    }

    //Getters y Setters
    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getTelefono() {
        return telefono;
    }

    public void setTelefono(int telefono) {
        this.telefono = telefono;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public int getCodigo_postal() {
        return Codigo_postal;
    }

    public void setCodigo_postal(int codigo_postal) {
        Codigo_postal = codigo_postal;
    }

    public int getId_tipo_usuario() {
        return id_tipo_usuario;
    }

    public void setId_tipo_usuario(int id_tipo_usuario) {
        this.id_tipo_usuario = id_tipo_usuario;
    }

    public int getCredito() {
        return credito;
    }

    public void setCredito(int credito) {
        this.credito = credito;
    }

    //toString

    @Override
    public String toString() {
        return "Usuario{" +
                "correo_electronico='" + correo_electronico + '\'' +
                ", nombre='" + nombre + '\'' +
                ", telefono=" + telefono +
                ", contrasena='" + contrasena + '\'' +
                ", Codigo_postal=" + Codigo_postal +
                ", id_tipo_usuario=" + id_tipo_usuario +
                ", credito=" + credito +
                '}';
    }
}
