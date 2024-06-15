package tfg.back.volta.entidades;

public class Favorito {

    //Variables
    private int id_favorito;
    private String correo_electronico;
    private int id_producto;


    //Constructores
    public Favorito() {
    }

    public Favorito(int id_favorito, String correo_electronico, int id_producto ) {
        this.id_favorito = id_favorito;
        this.correo_electronico = correo_electronico;
        this.id_producto = id_producto;
    }

    //Getters y Setters
    public int getId_favorito() {
        return id_favorito;
    }

    public void setId_favorito(int id_favorito) {
        this.id_favorito = id_favorito;
    }

    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }

    public int getId_producto() {
        return id_producto;
    }

    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }


}
