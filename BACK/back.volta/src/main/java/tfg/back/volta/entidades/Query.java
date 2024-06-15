package tfg.back.volta.entidades;

public class Query {

    //Variables
    private String id;
    private String query;

    //Constructores
    public Query() {
    }

    public Query(String id, String query) {
        this.id = id;
        this.query = query;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
