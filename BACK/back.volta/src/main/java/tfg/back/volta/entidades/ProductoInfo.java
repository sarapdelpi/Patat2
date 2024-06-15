package tfg.back.volta.entidades;

import java.util.ArrayList;
import java.util.List;

public class ProductoInfo {

    private Integer id_producto;

    private String imagenBase64;
    private String objetoCambio;
    private List<String> tipoCategorias;

    private String correo;

    private Integer puntos;


    public ProductoInfo(Integer id_producto, String objetoCambio, String imagenBase64, Integer puntos, String correo) {
        this.id_producto = id_producto;
        this.objetoCambio = objetoCambio;
        this.tipoCategorias = new ArrayList<>();
        this.imagenBase64 = imagenBase64;
        this.puntos = puntos;
        this.correo = correo;
    }

    public ProductoInfo(Integer id_producto, String objetoCambio, String imagenBase64, Integer puntos) {
        this.id_producto = id_producto;
        this.objetoCambio = objetoCambio;
        this.tipoCategorias = new ArrayList<>();
        this.imagenBase64 = imagenBase64;
        this.puntos = puntos;
    }

    public Integer getId_producto() {
        return id_producto;
    }

    public void setId_producto(Integer id_producto) {
        this.id_producto = id_producto;
    }

    public String getObjetoCambio() {
        return objetoCambio;
    }

    public List<String> getTipoCategorias() {
        return tipoCategorias;
    }

    public void addTipoCategoria(String tipoCategoria) {
        tipoCategorias.add(tipoCategoria);
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

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

}
