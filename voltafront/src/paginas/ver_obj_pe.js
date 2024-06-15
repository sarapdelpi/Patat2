import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../componentes/menu2';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';


  
function VerObjPe() {

    const { prod_id } = useParams();
    const [data, setData] = useState(null);
    const [imageData, setImageData] = useState(null);


// PETICION HTTP PARA OBTENER DATOS DE UN PRODUCTO
    useEffect(() => {

        const fetchDataFromAPI = async() => {

            try{
                const response = await fetch(`http://localhost:8080/producto/${prod_id}` /*+ prod_id*/, {
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
                setData(result);

                if(result && result.imagenBase64){
                    //setImageData = `data:image/jpeg;base64,${data.imagenBase64}`;
                    setImageData(`data:image/jpeg;base64,${result.imagenBase64}`); // Se guarda la imagen en la variable

                }
    
            }catch (error) {
                console.error("Error en la petición HTTP: ", error);
            }
        };

        fetchDataFromAPI();
      }, [prod_id] //Cambio aqui
    );
///////////////////////////


// LLAMADA API PARA AÑADIR A LISTA DE FAVORITOS UN OBJETO

    const handleFavoritos = async(e) => {
    

      try{
          const response = await fetch(`http://localhost:8080/producto/favoritosadd`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "id_producto": prod_id,
                "correo_electronico": localStorage.getItem('correo_usuario')
              })
          });

          if (!response.ok) {
              const errorText = await response.text(); // Intenta obtener el texto del error
              console.error("Error en la respuesta de la API:", response.statusText, errorText);
              return;
          }

            const result = await response.json();
            console.log("Success:", result);
            setData(result);
            
      }catch (error) {
          console.error("Error en la petición HTTP: ", error);
      }

    };

///////////////////////////
    

    return(

        <div>
            <NavBar/>

        

            {data && (
                <Contenedor>
                    <div>
                       {imageData && <Imagen src={imageData} alt={data.nombre} />} {/* Se muestra la imagen del objeto*/}
                    </div>
                    <Detalles>
                        <p><strong>Nombre del objeto: </strong>{data.nombre}</p>
                        <p><strong>Puntos: </strong>{data.puntos}</p>
                        <p><strong>Objeto deseado a cambio: </strong>{data.objeto_cambio}</p>
                    </Detalles>
                    <Botones>
                    <Link to='/chat' state={{nombre_producto: data.nombre, 
                        correo_propietario: data.correo_electronico
                        }}><button>Chatear</button></Link>
                    <Link to='/favoritos' onClick={()=> handleFavoritos()}><button>Favorito</button></Link>
                    <Link to='/transferencia_puntos' state={{id_producto: data.id_producto, 
                        correo_propietario: data.correo_electronico,
                        puntos_objeto: data.puntos }}><button>Comprar</button></Link>
                    </Botones>
                </Contenedor>
            )}
        </div>

    );

}

export default VerObjPe;

const Contenedor = styled.div`
background: #F9F9F9;
display: flex;
flex-direction: column;
align-items: center;
height: 100%;
`;


const Imagen = styled.img`
width: 500px; 
margin-top: 45px; /* Espacio entre imagen y menu */
`;


const Detalles = styled.div`
    flex: 1; /* El div de detalles ocupará el espacio restante */
    padding: 0 20px;
    
    p{
        margin-top: 5px; /* Espacio entre detalles */
    }
`;

const Botones = styled.div`
margin-top: 20px; /* Espacio entre detalles y botones */

button {
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #FF6A00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}

`;
