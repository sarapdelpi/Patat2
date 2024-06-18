import React from "react";
//import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBarInst from "../componentes/menu_inst";
import Cookies from "js-cookie";
//import { useEffect, useState } from "react";
import LogOut from "../imagenes/logout.png";

function MiEspacioInst() {

//OBTENER TOKEN AUTEFICACION DE LA COOKIE
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const token = getCookie('token');//Obtener token de autenticación
  console.log(token);
  /////////////////////////////////////////////////

  //LLAMADA A LA API PARA LOUGOUT
  const handleLogout = async () => {
    try {
      const token = Cookies.get("token"); // Obtener el token de la cookie
      console.log("Tokensito de autenticación: ", token);
      
      if (!token) {
        console.error("No se encontró el token de autenticación en la cookie");
        return;
      }
  
      const response = await fetch("http://54.91.34.240/usuario/logout?sessionId=" + token, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pasar el token como parte de la autorización
        },
      });
  
      if (!response.ok) {
        console.error("Error en la respuesta de la API:", response.statusText);
        return;
      }
  
      console.log("Sesión cerrada correctamente");
  
      // Eliminar la cookie
      Cookies.remove("token");
  
      // Redireccionar a la página de inicio de sesión
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  /////////////////////////////////////////////////


  return(
    <div>
        <NavBarInst/>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50, }}>
        <button onClick={handleLogout}>
            <BotonLogout>
            <img src={LogOut} alt="Logout" />
            </BotonLogout>
          </button> 
        </div>
    </div>
  )
       
}

export default MiEspacioInst;

const BotonLogout = styled.button`
    border: none;
    border-radius: 5%;
    padding: 10px;
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

        
 `;