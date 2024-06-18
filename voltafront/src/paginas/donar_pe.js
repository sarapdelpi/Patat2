import React, {useEffect, useState}from 'react';
import styled from 'styled-components';
import NavBar from '../componentes/menu2';



function DonarPe() {

    const [instituciones, setinstituciones] = useState([]);

    useEffect(() => {
        fetch('http://54.91.34.240/usuario/institucion/getInfo')
            .then(response => response.json())
            .then(data => setinstituciones(data));
    }, []);


    return(
        <div >
            <NavBar/>
            <Title>Contacte con la entidad a la que desea realizar una donación</Title>
            
            <Grid >

            <div className='container'>
            {instituciones.map(institucion => (
                <div className='item' key={institucion.nombre}>
               
                <div className='details'>
                    <p><strong>{institucion.nombre}</strong></p>
                    <p>{institucion.correo_electronico}</p>
                    <p>{institucion.telefono}</p>
                    <p>{institucion.codigo_postal}</p>
                </div>
                </div>
            ))}
                    
                  
            </div>

            </Grid>



        </div>
    );
}

export default DonarPe;


const Title = styled.h1`
    text-align: center;
    margin: 2rem 0;
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

