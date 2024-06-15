package tfg.back.volta.entidades;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class Producto {
    //Variables
    private MultipartFile imagen;

    private String imagenBase64;
    private int id_producto;
    private String nombre;
    private String objeto_cambio;
    private String correo_electronico;
    private List<String> categorias_producto;

    private Integer puntos;



    //Constructores
    public Producto() {
    }

    public Producto(int id_producto, String nombre, String objeto_cambio,
                    String correo_electronico, List<String> categorias_producto, MultipartFile imagen) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objeto_cambio;
        this.correo_electronico = correo_electronico;
        this.categorias_producto = categorias_producto;
        this.imagen = imagen;
    }

    public Producto(int id_producto, String nombre, String objetoCambio, List<String> categorias_producto) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objetoCambio;
        this.categorias_producto = categorias_producto;
    }

    public Producto(int id_producto, String nombre, String objetoCambio, List<String> categorias_producto,
                    String imagenBase64, Integer puntos) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objetoCambio;
        this.categorias_producto = categorias_producto;
        this.imagenBase64 = imagenBase64;
        this.puntos = puntos;
    }


    public Producto(int id_producto, String nombre, String objetoCambio, List<String> categorias_producto,
                    String imagenBase64, Integer puntos, String correo_electronico) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objetoCambio;
        this.categorias_producto = categorias_producto;
        this.imagenBase64 = imagenBase64;
        this.puntos = puntos;
        this.correo_electronico = correo_electronico;
    }


    public Producto(String nombre, String objetoCambio, List<String> categorias_producto) {
        this.nombre = nombre;
        this.objeto_cambio = objetoCambio;
        this.categorias_producto = categorias_producto;
    }

    public Producto(Integer id_producto, String nombre, String objeto_cambio) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objeto_cambio;
    }

    public Producto(Integer id_producto, String nombre, String objeto_cambio, String imagenBase64) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objeto_cambio;
        this.imagenBase64 = imagenBase64;
    }

    public Producto(int id_producto, String nombre, String objeto_cambio, String imagenBase64, Integer puntos) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.objeto_cambio = objeto_cambio;
        this.imagenBase64 = imagenBase64;
        this.puntos = puntos;
    }


    //Getters y Setters
    public int getId_producto() {
        return id_producto;
    }

    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getObjeto_cambio() {
        return objeto_cambio;
    }

    public void setObjeto_cambio(String objeto_cambio) {
        this.objeto_cambio = objeto_cambio;
    }

    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }

    public List<String> getCategorias_producto() {
        return categorias_producto;
    }

    public void setCategorias_producto(List<String> categorias_producto) {
        this.categorias_producto = categorias_producto;
    }

    public MultipartFile getImagen() {
        return imagen;
    }

    public void setImagen(MultipartFile imagen) {
        this.imagen = imagen;
    }

    public String getImagenBase64() {
        return imagenBase64;
    }

    public void setImagenBase64(String imagen) {
        this.imagenBase64 = imagenBase64;
    }


    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    //Método toString
    @Override
    public String toString() {
        return "Producto{" +
                ", id_producto=" + id_producto +
                ", nombre='" + nombre + '\'' +
                ", objeto_cambio='" + objeto_cambio + '\'' +
                ", correo_electronico='" + correo_electronico + '\'' +
                ", categorias_producto=" + categorias_producto +
                '}';
    }
}