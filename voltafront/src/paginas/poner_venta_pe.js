import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import NavBar from '../componentes/menu2';
import { useNavigate } from 'react-router-dom';


function PonerVentaPe() {

    const navigate =useNavigate();

    // Estados para los campos del formulario
    const [imagen, setImagen] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [productCambio, setproductCambio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [tusCategorias, setTusCategorias] = useState('');
    const [categorias, setCategorias] = useState([]);


    // Obtener las categorías de la API
    useEffect(() => {
        const fetchCategorias = async () => {
            try{
                const response = await fetch ('http://localhost:8080/categoria/getCategoriaPuntos');
                if (!response.ok) {
                    console.error('Error en la respuesta de la API:', response.statusText);
                    return null;
                }

                const data = await response.json();
                setCategorias(data);
            }catch (error) {
                console.error('Error:', error);
            }
        };
        fetchCategorias();
    }, []);

    const handleCategoriaChange = (event) => {//Función para manejar el cambio de la categoría
        const selectedCategoria = event.target.value;
        setCategoria(selectedCategoria);
        const categoriaSeleccionada = categorias.find(cat => cat.tipo_categoria === selectedCategoria);
        if (categoriaSeleccionada) {
            setPuntos(categoriaSeleccionada.puntos);
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault();

        var listaCategorias = [categoria].concat(tusCategorias.split(","));
        var listaCategoriasCreador = [];


        listaCategorias.forEach((categoria) => {
            listaCategoriasCreador.push({tipo_categoria: categoria,
                creador_categoria: localStorage.getItem('correo_usuario')
            });
        });

        const formDataCategorias = new FormData();
        formDataCategorias.append('categorias', listaCategoriasCreador);
   
        var formDataProducto = new FormData();
        formDataProducto.append('nombre', titulo);
        formDataProducto.append('imagen', imagen);
        formDataProducto.append('correo_electronico', localStorage.getItem('correo_usuario'))
        formDataProducto.append('objeto_cambio', productCambio);
        formDataProducto.append('categorias_producto', listaCategorias);


        fetch('http://localhost:8080/categoria/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listaCategoriasCreador),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Categorias creadas correctamente');

                fetch('http://localhost:8080/producto/add/imagen', {
                    method: 'POST',
                    body: formDataProducto
                })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log('Producto creado correctamente');
                        navigate('/inicio')
                })
                    .catch((error) => {
                        console.error('Error al crear el producto:', error);
                });
        })
            .catch((error) => {
            console.error('Error al guardar las categorias:', error);
        });
    };


   const handleTusCategoriasChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        const categoriasArray = inputValue;
        setTusCategorias(categoriasArray);
    };

        return (
            <div>
                <NavBar/>
                
                <Formulario onSubmit={handleSubmit}>
                    <Campo>
                        <label>Imagen:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagen(e.target.files[0])}
                            id="imagen-producto-usuario"
                            required
                        />
                    </Campo>
                    <Campo>
                        <label>Título:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </Campo>
                    <Campo>
                        <label>Que quiero a cambio:</label>
                        <input
                            type="text"
                            value={productCambio}
                            onChange={(e) => setproductCambio(e.target.value)}
                            required
                        />                       
                    </Campo>
                 
                    <Campo>
                        <label>Categoría:</label>
                        <select value={categoria} onChange={handleCategoriaChange} required>
                            <option value="">Selecciona una categoría</option>
                            {categorias.map(categoria => (
                            <option key={categoria.id_categoria} value={categoria.tipo_categoria}>
                                {categoria.tipo_categoria}
                            </option>
                        ))}
                        </select>
                    </Campo>
                    
                    <Campo>
                        <label>Tus categorías:</label>
                        <CampoCategorias>
                            <input
                                type="text"
                                value={tusCategorias}
                                onChange={handleTusCategoriasChange}
                                required
                            />
                        <LabelExplicativo>Añadiendo categorías al producto<br/>ayudas al resto de usuarios<br/>a encontrar tus productos.<br/>(Separa por comas <br/> cada categoría)</LabelExplicativo>    
                        </CampoCategorias>
                </Campo>
                  
                    <Campo>
                        <label>Puntos:</label>
                        <input type="number" value={puntos} readOnly />
                    </Campo>
                    <Boton type="submit">Subir Producto</Boton>
                </Formulario>
                
            </div>
        );

}

export default PonerVentaPe;


const Formulario = styled.form`
    width: 80%; /* Cambiar el ancho del formulario según sea necesario */
    max-width: 600px; /* Limitar el ancho máximo del formulario */
    margin: auto;
    margin-top: 2%;
    
`;


const Campo = styled.div`
    margin-bottom: 20px;

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }
`;

const CampoCategorias = styled.div`
    display: flex;
    align-items: center;

    input{
        flex: 1;
        margin-right: 10px;
    }
`;

const LabelExplicativo = styled.span`
    font-size: 12px;
    color: #666;
`;


const Boton = styled.button`
    padding: 10px 20px;
    background-color: #FF6A00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #4CAF50;
    }
`;