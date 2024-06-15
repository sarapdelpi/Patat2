import React from "react";
import styled from "styled-components";
import NavBar from "../componentes/menu2";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

function BuzonPe() {

  const [chats, setChats] = useState([]);

  useEffect(() => {
    
    const retrieveAllChats= async () => {
      try{
        const response = await fetch(`http://imagenback:8080/mensaje/verChats/${localStorage.getItem('correo_usuario')}`, {
            method: "GET",
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
        setChats(result);

      }catch (error) {
        console.error("Error en la petición HTTP: ", error);
      }
    };

    retrieveAllChats()
  }, []);


  return (
    <div >
      <NavBar/>
      
        <ContenedorBuzon >
          {chats.map((chat, index) => (
            <StyledLink to = "/chat" state={{nombre_producto: "", 
              correo_propietario: chat.correo_chat,
              no_leidos: chat.nuevosMensajes}}>
            <Mensaje key={index}>
              <NombreUsuario>{chat.nombre}</NombreUsuario>
              {chat.nuevosMensajes === 0 ? (
                <Fecha></Fecha>
              ):(
                <div>
                <NuevosMensajes>{chat.nuevosMensajes}</NuevosMensajes>
                </div>
              )
              }
              
            </Mensaje>
            </StyledLink>
          ))}
        </ContenedorBuzon>
      
    </div>
  );
}

export default BuzonPe;


const ContenedorBuzon = styled.div`
    padding: 20px;
`;

const Mensaje = styled.div`
background-color: #e0e0e0; /* Color de fondo inicial */
border-radius: 5px;
padding: 10px;
margin-bottom: 10px;
cursor: pointer; /* Cambia el cursor a una mano */
transition: background-color 0.3s; /* Agrega una transición suave */

&:hover {
    background-color: #c0c0c0; /* Cambia el color de fondo al pasar el ratón */
}
`;

const NombreUsuario = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`;

const Fecha = styled.div`
    font-size: 0.8em;
    color: #666;
`;

const NuevosMensajes = styled.div`
  background-color: red; /* Color de fondo rojo para el indicador de nuevos mensajes */
  color: white; /* Color de texto blanco */
  border-radius: 50%; /* Forma circular */
  width: 20px; /* Ancho y alto iguales para una forma perfecta */
  height: 20px; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em; /* Tamaño de fuente ajustado */
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* Elimina el subrayado */
  color: inherit; /* Usa el color heredado del padre */
`;

