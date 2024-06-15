package tfg.back.volta.utils;



import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.util.Base64Utils;

import java.io.IOException;


public class Base64ByteArrayDeserializer extends JsonDeserializer<byte[]> {

    @Override
    public byte[] deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        String base64String = jsonParser.getText();
        return Base64Utils.decodeFromString(base64String);
    }
}