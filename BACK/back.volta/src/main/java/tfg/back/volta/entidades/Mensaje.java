package tfg.back.volta.entidades;

import java.util.Date;

public class Mensaje {

    //Variables
    private int id_mensaje;
    private String id_emisor;
    private String id_receptor;
    private String contenido;
    private Date fecha_envio;
    private boolean leido;

    //Constructores
    public Mensaje() {
    }

    public Mensaje(int id_mensaje, String id_emisor, String id_receptor, String contenido, Date fecha_envio, boolean leido) {
        this.id_mensaje = id_mensaje;
        this.id_emisor = id_emisor;
        this.id_receptor = id_receptor;
        this.contenido = contenido;
        this.fecha_envio = fecha_envio;
        this.leido = leido;
    }

    //Getters y Setters
    public int getId_mensaje() {
        return id_mensaje;
    }

    public void setId_mensaje(int id_mensaje) {
        this.id_mensaje = id_mensaje;
    }

    public String getId_emisor() {
        return id_emisor;
    }

    public void setId_emisor(String id_emisor) {
        this.id_emisor = id_emisor;
    }

    public String getId_receptor() {
        return id_receptor;
    }

    public void setId_receptor(String id_receptor) {
        this.id_receptor = id_receptor;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFecha_envio() {
        return fecha_envio;
    }

    public void setFecha_envio(Date fecha_envio) {
        this.fecha_envio = fecha_envio;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }


    //toString
    @Override
    public String toString() {
        return "Mensaje{" +
                "id_mensaje=" + id_mensaje +
                ", id_emisor='" + id_emisor + '\'' +
                ", id_receptor='" + id_receptor + '\'' +
                ", contenido='" + contenido + '\'' +
                ", fecha_envio=" + fecha_envio +
                ", leido=" + leido +
                '}';
    }
}
