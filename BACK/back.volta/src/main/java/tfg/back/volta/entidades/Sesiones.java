package tfg.back.volta.entidades;


import java.util.Date;

public class Sesiones {
  //Variables
    private String idSesion;
    private Date fecha_inicio;
    private String correo_electronico;

    //Constructores
    public Sesiones() {
    }

    public Sesiones(String idSesion, Date fecha_inicio, String correo_electronico) {
        this.idSesion = idSesion;
        this.fecha_inicio = fecha_inicio;
        this.correo_electronico = correo_electronico;
    }

    //Getters y Setters
    public String getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(String idSesion) {
        this.idSesion = idSesion;
    }

    public Date getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(Date fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }
    //Método toString


    @Override
    public String toString() {
        return "Sesiones{" +
                "idSesion='" + idSesion + '\'' +
                ", fecha_inicio=" + fecha_inicio +
                ", correo_electronico='" + correo_electronico + '\'' +
                '}';
    }
}
