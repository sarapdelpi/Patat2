import React, {useState} from 'react';   
import styled from 'styled-components';
import NavBarInst from "../componentes/menu_inst";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ChatInst () {
  const location = useLocation();
  const nombreProducto = location.state?.nombre_producto;
  const correoPropietario = location.state?.correo_propietario;
  const noLeidos = location.state?.no_leidos;

  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState();
  


   // Maneja el envío de un nuevo mensaje
  const handleEnviarMensaje = async () => { 
    
    if (nuevoMensaje.trim() !== "") {
      var fechaEnvio = new Date();
      console.log(fechaEnvio)
      
      //Crear el mensaje para el estado local
      const mensaje = { texto: nuevoMensaje, fecha: fechaEnvio.toLocaleString() };
      setMensajes([...mensajes, mensaje]);



      const url = `http://imagenback:8080/mensaje/add`;

      try{
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_emisor: localStorage.getItem('correo_usuario'),
            id_receptor: correoPropietario,
            contenido: nuevoMensaje,
            fecha_envio: fechaEnvio,
            leido: false
          })
      });

      if (!response.ok) {
        const errorText = await response.text(); // Intenta obtener el texto del error
        console.error("Error en la respuesta de la API:", response.statusText, errorText);
        return;
      }
      
      const result = await response.json();
      console.log("Success:", result);
    
      }catch (error) {
        console.error("Error en la petición HTTP: ", error);
      }
      
      setNuevoMensaje("");
    }
  };


//// aqui 

const retrieveAllMessages = async() => {

  if(nombreProducto !== "")
  {
    setNuevoMensaje('Hola! Estoy interesado en ' + nombreProducto);
  }

  try{
    const response = await fetch(`http://imagenback:8080/mensaje/verAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario1: localStorage.getItem('correo_usuario'),
          usuario2: correoPropietario
        })
    });

    if (!response.ok) {
      const errorText = await response.text(); // Intenta obtener el texto del error
      console.error("Error en la respuesta de la API:", response.statusText, errorText);
      return;
    }

    const result = await response.json();
    console.log("Success:", result);
    setMensajes(result);

  }catch (error) {
    console.error("Error en la petición HTTP: ", error);
  } 
};


const marcarLeidos = async() => {
  
  try{
    const response = await fetch(`http://imagenback:8080/mensaje/marcarLeidos/${correoPropietario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
      const errorText = await response.text(); // Intenta obtener el texto del error
      console.error("Error en la respuesta de la API:", response.statusText, errorText);
      return;
    }

    const result = await response.json();
    console.log("Success:", result);

  }catch (error) {
    console.error("Error en la petición HTTP: ", error);
  }
};


useEffect(() => {
retrieveAllMessages();
if(noLeidos !== 0)
{
  marcarLeidos();
}
}, [nombreProducto, correoPropietario, noLeidos]);



///////////
// Llama a retrieveAllMessages cada 5 segundos para actualizar los mensajes
useEffect(() => {
  const interval = setInterval(() => {
    retrieveAllMessages();
  }, 5000); // Llama a retrieveAllMessages cada 5 segundos

  return () => clearInterval(interval);
}, []);



    return (
        <div>
      <NavBarInst />
      <ChatContainer>
        <MensajesContainer>
          {mensajes.map((mensaje, index) => (
            <Mensaje key={index} isEmisor={mensaje.id_emisor === localStorage.getItem('correo_usuario')}>
              <TextoMensaje>{mensaje.contenido}</TextoMensaje>
              <FechaMensaje>{mensaje.fecha_envio}</FechaMensaje>
            </Mensaje>
          ))}
        </MensajesContainer>
        <InputContainer>
          <InputMensaje
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <BotonEnviar onClick={handleEnviarMensaje}>Enviar</BotonEnviar>
        </InputContainer>
      </ChatContainer>
    </div>
  );
}

export default ChatInst;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
    margin: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    height: 80vh;
`;

const MensajesContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    ///
    display: flex;
    flex-direction: column;
`;

const Mensaje = styled.div`
    padding: 10px;
   // background-color: #f1f1f1;
    background-color: ${props => props.isEmisor ? '#d1ffd1' : '#f1f1f1'}; // Color diferente según el emisor
    border-radius: 5px;
    margin-bottom: 10px;
    /////
    max-width: 70%; // Tamaño máximo del mensaje
    align-self: ${props => props.isEmisor ? 'flex-end' : 'flex-start'}; // Alinear mensajes a la derecha si es el emisor
`;

const TextoMensaje = styled.div`
    display: flex;
`;

const FechaMensaje = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const InputMensaje = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const BotonEnviar = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: #FF6A00;
    color: white;
    border-radius: 0 5px 5px 0;
    cursor: pointer;

    &:hover {
        background-color: #4CAF50;
    }
`;