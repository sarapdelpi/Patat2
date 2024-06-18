import React, {useState} from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import NavBarInst from '../componentes/menu_inst';
import { Link } from 'react-router-dom';

function InicioInst() {
    const [searchTerm, setSearchTerm] = useState('');// Estado para el término de búsqueda
    const [searchResults, setSearchResults] = useState([]);// Estado para los resultados de la búsqueda
    const [allProdsData, setAllProdsData] = useState(null);

    const handleSearchChange = (e) => {// Manejador para el cambio en la barra de búsqueda
        setSearchTerm(e.target.value);
    };

    //OBTENER TOKEN AUTEFICACION DE LA COOKIE
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    /////////////////////////////////////////////

    //PETICION HTTP PARA BUSCAR PRODUCTOS
    const handleSearch = async(e) => {

        try{
            const response = await fetch(`http://54.91.34.240/producto/buscar`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_producto: searchTerm,//categorias: listaCategorias,
                    hash_sesion: getCookie('token')
                })
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
                    <Grid>
                    <div className='container'>
                    <div className='item' >  
                    <StyledLink as={Link} to={`/ver_objeto/${producto.id_producto}`}>
                    <div className='details' key={producto.id_producto}>
                        <img src={imageData} alt={producto.nombre} style={{width: '200px'}} />
                        <h2>{producto.nombre}</h2>
                        <p>{producto.objeto_cambio}</p>
                    </div>
                </StyledLink>
                </div>
                </div>
                </Grid>
                );
            });

            setSearchResults(productosConImagen); // Actualizar el estado con los resultados de la búsqueda
              
        }catch (error) {
            console.error("Error en la petición HTTP: ", error);
        }

    };
    ///////////////////////////////////////////////

    //PETICIÓN HTTP PARA OBTENER PRODUCTOS AL INICIO
    useEffect(() => {

        const fetchTodos = async() => {

            try{
                const response = await fetch(`http://54.91.34.240/producto/inicio/${localStorage.getItem('correo_usuario')}`, {
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
                
                
                const productosConImagen = result.map((producto) => {
                    const imageData = `data:image/jpeg;base64,${producto.imagenBase64}`;
                    return (
                        <Grid>
                        <div className='container'>
                        <div className='item' >  
                        <StyledLink as={Link} to={`/ver_objeto_inst/${producto.id_producto}`}>
                        <div className='details' key={producto.id_producto}>
                            <img src={imageData} alt={producto.nombre} style={{width: '200px'}} />
                            <h2>{producto.nombre}</h2>
                            <p>{producto.objeto_cambio}</p>
                        </div>
                    </StyledLink>
                    </div>
                    </div>
                    </Grid>
                    );
                });
    
                setAllProdsData(productosConImagen);
                
    

            }catch (error) {
                console.error("Error en la petición HTTP: ", error);
            }
        };

        fetchTodos();
    }, [] //Cambio aqui
);
///////////////////////////////////////////////

    return(
        <div>
            <NavBarInst/>

            <SearchContainer>
                <SearchInput
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar..."
                />
                <SearchButton onClick={handleSearch}>Buscar</SearchButton>
            </SearchContainer>
            
            <div>
                {searchResults.length> 0 ? (
                    <Grid>
                        <div className='container'>
                            {searchResults}
                        </div>
                    </Grid>
                ) : (
                       <p></p>

                )}
                {allProdsData == null ? (
                    <p>Cargando...</p>
                ) : (
                    allProdsData.length> 0 ? (
                       <Grid>
                           <div className='container'>
                               {allProdsData}
                           </div>
                    </Grid> ) : (
                           <p></p>       
                    )
                )}
            </div>

        </div>
    );

}

export default InicioInst;

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0; /* Espacio entre el menú y la barra de búsqueda */
`;

const SearchInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    width: 300px; /* Ajusta el ancho según sea necesario */
`;

const SearchButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #FF6A00;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;

    &:hover {
        background-color: #4CAF50;
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
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Aseguramos que todos los items tengan el mismo tamaño */
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


