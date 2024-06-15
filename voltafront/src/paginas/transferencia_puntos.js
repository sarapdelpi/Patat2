import React, {useState} from "react";
import styled from "styled-components";
import NavBar from "../componentes/menu2";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";


function TransferenciaPuntos() {


    const location = useLocation();
    const idProducto = location.state?.id_producto;
    const correoPropietario = location.state?.correo_propietario;
    const puntosObjeto = location.state?.puntos_objeto;

    //Estados para los campos del formulario
    //const [data, setData] = useState('');
    const [puntos, setPuntos] = useState(puntosObjeto);
    //const [mensajeError, setMensajeError] = useState('');
    const [correo, setCorreo] = useState({
        correo_electronico_comprador: "",
   
      });
      

    const handleTransferirPuntos = () =>{
        //Implementar petición a la API para transferir los puntos
        console.log(`Transferir ${puntos} puntos a  ${correo}:`);
        //Lógica adicional, como enviar los datos a una API, guardarlos en una base de datos, etc.

        const idProductoStr = encodeURIComponent(String(idProducto));
        const correoPropietarioStr = encodeURIComponent(correoPropietario);
        const correoUsuarioStr = encodeURIComponent(localStorage.getItem('correo_usuario'));

        const url = `http://imagenback:8080/producto/vender/${idProductoStr}/${correoPropietarioStr}/${correoUsuarioStr}/${puntos}`;



        try{
            const response = fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                }
            });
  
            if (!response.ok) {
                const errorText = response.text; // Intenta obtener el texto del error
                console.error("Error en la respuesta de la API:", response.statusText, errorText);
                return;
            }
  
              const result = response.json();
              console.log("Success:", result);
              //setData(result);
              
        }catch (error) {
            console.error("Error en la petición HTTP: ", error);
        }
    };

    return(
        <div>
            <NavBar/>
            <ContenedorFormulario>
            <Titulo>Transfiere tus puntos a otro usuario</Titulo>
            <Aviso>Cerciorese de que transfiere la cantidad de puntos adecuada a la persona correcta antes de confirmar</Aviso>
            <Formulario>
                <Campo>
                    <label>Correo electrónico:</label>
                    <input
                        type="email"
                        value={correoPropietario}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                   {/* <BotonBuscar onClick={handleBuscarCorreo}>Verificar</BotonBuscar>*/}
                </Campo>

                {/*mensajeError && <MensajeError>{mensajeError}</MensajeError>*/}

                <Campo>
                    <label>Puntos a transferir:</label>
                    <input
                        type="number"
                        value={puntos}
                        onChange={(e) => setPuntos(e.target.value)}
                        required
                    />
                </Campo>

                <Link to='/inicio'><BotonTransferir onClick={handleTransferirPuntos}>Confirmar</BotonTransferir></Link>
            </Formulario>
            </ContenedorFormulario>
        </div>
    );
}

export default TransferenciaPuntos;

const ContenedorFormulario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh; /* Altura para centrar verticalmente */
    text-align: center;
    `;

const Titulo = styled.h1`
    font-size: 2.5em;
    margin-bottom: 20px;
`;

const Aviso = styled.p`
    font-size: 1em;
    color: #666;
    margin-bottom: 20px;
`;

const Formulario = styled.div`
    width: 80%;
    max-width: 600px;
    margin: auto;
    margin-top: 3%;
    `;

const Campo = styled.div`
    margin-bottom: 20px;
    
    label{
        display: block;
        margin-bottom: 5px;
    }

    input{
        width:100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    
    `;

/*const BotonBuscar = styled.button`
    padding: 10px 20px;
    color: white;
    background-color: #FF6A00;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition:background-color .3s;
    margin-top: 10px;

    &:hover{
        background-color: #4CAF50;
    }
    `;*/

const BotonTransferir = styled.button`
padding: 10px 20px;
color: white;
background-color: #FF6A00;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 16px;
transition:background-color .3s;
margin-top: 10px;

&:hover{
    background-color: #4CAF50;
}
`;

/*const MensajeError = styled.div`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
    `;*/