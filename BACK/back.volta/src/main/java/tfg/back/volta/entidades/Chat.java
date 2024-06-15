package tfg.back.volta.entidades;

public class Chat {

    private String nombre;
    private Integer nuevosMensajes;
    private String correo_chat;

    public Chat(String nombre, Integer nuevosMensajes, String correo_chat) {
        this.nombre = nombre;
        this.nuevosMensajes = nuevosMensajes;
        this.correo_chat = correo_chat;
    }

    public Chat(){}

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getNuevosMensajes() {
        return nuevosMensajes;
    }

    public void setNuevosMensajes(Integer nuevosMensajes) {
        this.nuevosMensajes = nuevosMensajes;
    }

    public String getCorreo_chat() {
        return correo_chat;
    }

    public void setCorreo_chat(String correo_chat) {
        this.correo_chat = correo_chat;
    }
}
