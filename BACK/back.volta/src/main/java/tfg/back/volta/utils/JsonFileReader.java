package tfg.back.volta.utils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import tfg.back.volta.entidades.Query;

import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JsonFileReader {

    private final ResourceLoader resourceLoader;

    private final Gson gson = new Gson();

    public JsonFileReader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public String readQueriesJsonFile(String filename, String id) throws IOException {
        // Se obtiene el contenido del fichero Json de las queries
        Resource resource = resourceLoader.getResource("classpath:" + filename);
        InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);

        // Query que se va a devolver,
        Query returnQuery = new Query();

        Type listType = new TypeToken<List<Query>>() {}.getType();

        List<Query> queries = gson.fromJson(reader, listType);

        for (Query q: queries) {
            if(q.getId().equals(id)){
                returnQuery.setId(q.getId());
                returnQuery.setQuery(q.getQuery());
            }
        }

        return returnQuery.getQuery();
    }
}
