import React from 'react';
import styled from 'styled-components';
import NavBar from '../componentes/menu2';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";



function FavoritosPe() {

    const [favs, setFavs] = useState(null);


    useEffect(() => {
        const getFavoritos = async(e) => {
        
          try{
              const response = await fetch(`http://imagenback:8080/producto/get-favoritos/${localStorage.getItem('correo_usuario')}`, {
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

              const favoritosObtenidos = result.map((producto) => {
                  const imageData = `data:image/jpeg;base64,${producto.imagenBase64}`;
                  return (
                      <div>
                        <Grid>
                        <div className='container'>
                        <StyledLink as={Link} to={`/ver_objeto/${producto.id_producto}`}>
                        <div className='item'>
                    
                        <img src={imageData} alt=''/>
                        <div className='details' style={{width: '300px'}}>
                            <p><strong>Nombre del objeto: </strong>{producto.nombre}</p> 
                            <p><strong>Puntos: </strong>{producto.puntos}</p>
                            <p><strong>Objeto deseado a cambio: </strong>{producto.objeto_cambio}</p>
                        </div>
                        
                        </div>
                        </StyledLink>
                        </div>
                        </Grid>
                      </div>
                  );
              });
    
              setFavs(favoritosObtenidos); // Actualizar el estado con los resultados de la búsqueda
                
          }catch (error) {
              console.error("Error en la petición HTTP: ", error);
          }
    
        };
    
        getFavoritos();
    }, []); //Cambio aqui


    return(
        <div>
            <NavBar/>

            <Contenido>
                
                <h1>Tus favoritos</h1>
                <p className='descripcion'>Estos son los productos de Volta que más te gustan</p>
                

                <div>
                {favs == null ? (
                    <p>Cargando...</p>
                ) : (
                    favs.length> 0 ? (
                        <Grid>
                            <div className='container'>
                                {favs}
                            </div>
                        </Grid>
                    ) : (
                           <p></p>
    
                    )
                )}
                
            </div>
            </Contenido>
        </div>

    );

}

export default FavoritosPe;


const Contenido = styled.div`
h1 {
    text-align: left;
    margin-left: 10%;
    margin-bottom: -10px;
}

.descripcion{
    text-align: left;
    margin-left: 10%;
    margin-bottom: -10px;
    color: gray; 
}
`;

const Grid = styled.div`
    position: relative;
    z-index: ${props => props.isMenuOpen ? '0' : '1'};
    width: 100%;
    margin: 4rem 0;
    text-align: center;

     /* Centramos el contenido del grid */
    display: flex;
    justify-content: center;
    align-items: center;


    > div {
        display: flex;
        justify-content: center;
        ////
        width: 100%;
        max-width: 1200px;
    }

    > div p {
        margin: 1rem 2rem;
        font-size: 1.2rem;
        color: black;

    }

    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1.2rem;
        padding: 1rem;
        /////
        justify-items: center;
        align-items: start; /* Alineamos los items en la parte superior del grid */

      
    }

    .container .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: center; /* Centra horizontalmente */
        ////
        width: 100%;
        max-width: 250px; /* Aseguramos un ancho máximo para los items */
        padding: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Añadimos una sombra para resaltar los items */
        border-radius: 8px; /* Redondeamos los bordes */
        background-color: white; /* Fondo blanco para los items */
        transition: background-color 0.3s;

    }

    .container .item img {
        width: 100%;
        max-width: 200px;
        height: auto;
    }

    .container .item .details {
        margin-top: 0.5rem;
    }

    .container .item .details p {
        font-size: 0.75rem;
        line-height: 0.2rem;
    }

    @media screen and (max-width: 768px) {
        margin: 1rem 0;

        > div p {
            margin: 1rem;
            font-size: 1rem;
            color: black;
        }

        .container {
            grid-template-columns: 1fr;
            grid-gap: 0.5rem;
        }
    }


    .item{
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover{
            background-color: lightgray;  
        }
    }
`;

const StyledLink = styled(Link)`
  /* Estilos personalizados */
  text-decoration: none; /* Elimina el subrayado */
  color: inherit; /* Usa el color heredado del padre */
`;
