package tfg.back.volta.entidades;

public class Categoria {
/*Categorías:
    - 1)Libros/material papeleria: 80 puntos
    - 2)Ropa: 60 puntos
    - 3)Equipo electrónico: 100 puntos
    - 4)Material deportivo: 40 puntos
    - 5)Apuntes: 20 puntos*/


    //Variables
    private int id_categoria;
    private int puntos;
    private String tipo_categoria;

    private boolean predefinido;
    private String creador_categoria;


    //Constructores
    public Categoria() {
    }

    public Categoria(int id_categoria, int puntos, String tipo_categoria, boolean predefinido, String creador_categoria) {
        this.id_categoria = id_categoria;
        this.puntos = puntos;
        this.tipo_categoria = tipo_categoria;
        this.predefinido = predefinido;
        this.creador_categoria = creador_categoria;
    }

    public Categoria(String tipo_categoria, String creador_categoria)
    {
        this.tipo_categoria = tipo_categoria;
        this.creador_categoria = creador_categoria;
    }

    public Categoria(int id_categoria, String tipo_categoria, int puntos) {
        this.id_categoria = id_categoria;
        this.tipo_categoria = tipo_categoria;
        this.puntos = puntos;
    }


    //Getters y Setters
    public int getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(int id_categoria) {
        this.id_categoria = id_categoria;
    }

    public int getPuntos() {
        return puntos;
    }

    public void setPuntos(int puntos) {
        this.puntos = puntos;
    }

    public String getTipo_categoria() {
        return tipo_categoria;
    }

    public void setTipo_categoria(String tipo_categoria) {
        this.tipo_categoria = tipo_categoria;
    }

    public boolean isPredefinido() {
        return predefinido;
    }
    public void setPredefinido(boolean predefinido) {
        this.predefinido = predefinido;
    }

    public String getCreador_categoria() {
        return creador_categoria;
    }
    public void setCreador_categoria(String creador_categoria) {
        this.creador_categoria = creador_categoria;
    }


    //ToString
    @Override
    public String toString() {
        return "Categoria{" +
                "id_categoria=" + id_categoria +
                ", puntos=" + puntos +
                ", tipo_categoria='" + tipo_categoria + '\'' +
                ", predefinido=" + predefinido +
                ", creador_categoria='" + creador_categoria + '\'' +
                '}';
    }
}
