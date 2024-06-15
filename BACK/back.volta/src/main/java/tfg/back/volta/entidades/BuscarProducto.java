package tfg.back.volta.entidades;

import java.util.List;

public class BuscarProducto {

    private String nombre_producto;
    private List<String> categorias;
    private String hash_sesion;

    public BuscarProducto(String nombre_producto, List<String> categorias, String hash_sesion) {
        this.nombre_producto = nombre_producto;
        this.categorias = categorias;
        this.hash_sesion = hash_sesion;
    }

    public BuscarProducto() {
    }


    public String getNombre_producto() {
        return nombre_producto;
    }

    public void setNombre_producto(String nombre_producto) {
        this.nombre_producto = nombre_producto;
    }

    public List<String> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public String getHash_sesion() {
        return hash_sesion;
    }

    public void setHash_sesion(String hash_sesion) {
        this.hash_sesion = hash_sesion;
    }

}


