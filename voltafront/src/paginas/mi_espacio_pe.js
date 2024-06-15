import React from "react";
import styled from "styled-components";
//import LibroHistoria from "../imagenes/libro_historia.jpg";
import NavBar from "../componentes/menu2";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LogOut from "../imagenes/logout.png";

function MiEspacioPe() {

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [objetosEnVenta, setObjetosEnVenta] = useState([]);
  const [searchResults, setSearchResults] = useState([]);// Estado para los resultados de la búsqueda
  const [allProdsData, setAllProdsData] = useState(null);



  //OBTENER TOKEN AUTEFICACION DE LA COOKIE
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const token = getCookie('token');//Obtener token de autenticación
  console.log(token);
  /////////////////////////////////////////////////

  //LLAMADA A LA API PARA OBTENER EL NOMBRE DEL USUARIO
   const fetchNombreUsuario = async () => {

    try {
      // Obtén el token de autenticación de la cookie
      const token = getCookie('token'); 
      
      const response = await fetch("http://imagenback:8080/usuario/getUserInfo?sessionId=" + token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        console.error('Error en la respuesta de la API:', response.statusText);
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      return null;
    }
  };
  // Uso de useEffect para obtener el nombre del usuario al cargar el componente
    useEffect(() => {
      const obtenerNombreYPuntos = async () => {
        const info = await fetchNombreUsuario();
        if (info) {
          setNombreUsuario(info.nombre);
          setPuntosUsuario(info.credito);
        } else {
          console.error('No se pudo obtener el nombre del usuario.');
        }
      };
      obtenerNombreYPuntos();
    }, []);
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
  
      const response = await fetch("http://imagenback:8080/usuario/logout?sessionId=" + token, {
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

//LLAMADA A LA API PARA ELIMINAR OBJETO EN VENTA
const handleDelete = async (id_producto) => {
  try {
    const response = await fetch(`http://imagenback:8080/producto/${id_producto}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la respuesta de la API:", response.statusText, errorText);
      return;
    }

    // Eliminar el producto del estado
    setObjetosEnVenta(objetosEnVenta.filter(objeto => objeto.id_producto !== id_producto));
    
    const currentUrl = window.location.pathname;
    const firstSegment = currentUrl.split('/')[0];
    window.location.replace(firstSegment + '/mi_espacio'); // redirect to /productos URL

  } catch (error) {
    console.error("Error en la petición HTTP: ", error);
  }
};



useEffect(() => {
    const handleSearch = async(e) => {
    

      try{
          const response = await fetch(`http://imagenback:8080/producto/getUser/${localStorage.getItem('correo_usuario')}`, {
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
          
          // Renderizar la imagen de cada producto
          const productosConImagen = result.map((producto) => {
              const imageData = `data:image/jpeg;base64,${producto.imagenBase64}`;
              return (
                  <ContenedorPublicaciones>
                    <StyledLink as={Link} to={`/ver_objeto/${producto.id_producto}`}>
                    <ItemVenta  >
                    <ImagenObjeto src={imageData} alt="" />
                    <DetallesVenta>
                      <p>
                        <strong>Nombre: </strong>
                        {producto.nombre}
                      </p>
                    <p>
                      <strong>Puntos: </strong>
                      {producto.puntos}
                    </p>
                    <p>
                      <strong>Objeto deseado a cambio: </strong>
                      {producto.objeto_cambio}
                    </p>
                    <BotonEliminar onClick={()=> handleDelete(producto.id_producto)} >Eliminar</BotonEliminar>
                  </DetallesVenta>
                  </ItemVenta>
                  </StyledLink>
                  </ContenedorPublicaciones>
              );
          });

          setSearchResults(productosConImagen); // Actualizar el estado con los resultados de la búsqueda
            
      }catch (error) {
          console.error("Error en la petición HTTP: ", error);
      }

    };

    handleSearch();
}, []); //Cambio aqui

///////////////////////////////////////////////



  return (
    <div>
      <NavBar />

      
        <Titulo>
          <Link as={Link} to="/poner_venta"><BotonVenta >Poner en venta</BotonVenta></Link>
          <PuntosUsuario>{puntosUsuario} puntos</PuntosUsuario>
          <button onClick={handleLogout}>
            <BotonLogout>
            <img src={LogOut} alt="Logout" />
            </BotonLogout>
          </button> 
          <NombreUsuario>{nombreUsuario}</NombreUsuario>
        </Titulo>


        <ContenedorPublicaciones>
        {searchResults.length> 0 ? (
                    <ContenedorPublicaciones>
                        <div className='container'>
                            {searchResults}
                        </div>
                    </ContenedorPublicaciones>
                ) : (
                       <p></p>

                )}
                {allProdsData == null ? (
                    <p>No se han encontrado productos</p>
                ) : (
                    allProdsData.length> 0 ? (
                       <ContenedorPublicaciones>
                           <div className='container'>
                               {allProdsData}
                           </div>
                    </ContenedorPublicaciones> ) : (
                           <p></p>       
                    )
                )}
          
        </ContenedorPublicaciones>
    
    </div>
  );
}

export default MiEspacioPe;


const Titulo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-top: 3%;

    flex-wrap: wrap; /*Permite que los elementos se ajusten*/

    @media (max-width: 768px) {
        flex-direction: column; // Cambia la dirección del flexbox a columna
        align-items: center;  
    }

`;

const BotonVenta = styled.button`
    padding: 15px 30px;
    background-color: #FF6A00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 60px;

    &:hover {
        background-color: #4CAF50;
    }

    @media (max-width: 768px) {
      margin:0;
      margin-bottom: 1%;
    }
`;

const BotonLogout = styled.button`
  border: none;
  widht: 35px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
  }
`;

const PuntosUsuario = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
   
`;

const NombreUsuario = styled.div`
    font-size: 16px;
    margin-right: 5%;
`;

const ContenedorPublicaciones = styled.div`
  display: flex;
  justify-content: center; /* Centra los elementos horizontalmente */
  flex-direction: column; /* Cambia la dirección del flexbox a fila */
  margin-top: 20px; /* Espacio entre el título y los elementos */
`;

const ItemVenta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  //background-color: #f0f0f0; /* Color de fondo para resaltar los elementos */
  //padding: 10px;
  text-decoration: none; /* Elimina el subrayado */
  justify-content: space-between;
  margint-bottom: 0px;
  ///////
        padding: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Añadimos una sombra para resaltar los items */
        border-radius: 8px; /* Redondeamos los bordes */
        background-color: white; /* Fondo blanco para los items */
        transition: background-color 0.3s;


&:hover {
    background-color: #c0c0c0; /* Cambia el color de fondo al pasar el ratón */
    cursor: pointer; /* Muestra un cursor de puntero al pasar el ratón */
}
`;

const BotonEliminar = styled.button`
padding: 15px 30px;
background-color: #FF6A00;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
margin-left: 30%;

&:hover {
    background-color: #4CAF50;
}
`;

const ImagenObjeto = styled.img`
    width: 100px;
    height: auto;
    margin-left: 10%;
`;

const DetallesVenta = styled.div`
    gap: 10px;
    margin-right: 30%;
    
    @media (max-width: 768px) {
      margin-left: 10%;
    }
`;

const StyledLink = styled(Link)`
  /* Estilos personalizados */
  text-decoration: none; /* Elimina el subrayado */
  color: inherit; /* Usa el color heredado del padre */
`;