import React, { useState, useEffect } from "react";
//import {Link} from 'react-router-dom';
import "../hojas_estilo/pag_registros2.css";
//import { useNavigate } from "react-router-dom";
//import Pag_registros2_cnx from "../componentes/conexiones_back/pag_registros2_cnx";
import Cookies from "js-cookie";

function PagRegistros2() {
  //FUNCION PARA ALTENER LOS FORMULARIOS
  const toggleForm = (formType) => {
    const loginForm = document.getElementById("loginForm");
    const signupFormPe = document.getElementById("signupFormPe");
    const signupFormIn = document.getElementById("signupFormIn");

    if (formType === "login") {
      loginForm.classList.add("open");
      signupFormPe.classList.remove("open");
      signupFormIn.classList.remove("open");
    } else if (formType === "signup") {
      signupFormPe.classList.add("open");
      loginForm.classList.remove("open");
      signupFormIn.classList.remove("open");
    } else if (formType === "signupin") {
      signupFormIn.classList.add("open");
      loginForm.classList.remove("open");
      signupFormPe.classList.remove("open");
    }
  };
////////////////////////////////////////////////////

// ESTADOS PARA LOS FORMULARIOS
const [loginFormData, setLoginFormData] = useState({
  email: "",
  password: "",
});

const [signupPeFormData, setSignupPeFormData] = useState({
  telefono: "",
  nombre_apellidos: "",
  email_signup: "",
  verif_email_signup: "",
  password_signup: "",
  verifpass_signup: "",
  institucion: "",
  chec_signupPe: false,
});

const [signupInFormData, setSignupInFormData] = useState({
  telefono_in: "",
  razon_social: "",
  email_in: "",
  verif_email_in: "",
  password_in: "",
  verifpass_in: "",
  codigo_postal: "",
  chec_signupIn: false,
});
////////////////////////////////////////////////////

// ESTADOS PARA REDIRECCIONES
  const [loginRedirect, setLoginRedirect] = useState(false); //Estado para controlar si se redirige al usuario a otra página
  const [signupPeRedirect, setSignupPeRedirect] = useState(false); //Estado para controlar si se redirige al usuario a otra página
  const [signupInRedirect, setSignupInRedirect] = useState(false); //Estado para controlar si se redirige al usuario a otra página
  const [loginRedirectUrl, setLoginRedirectUrl] = useState(""); //Estado para almacenar la URL a la que se redirigirá al usuario
  const [signupPeRedirectUrl, setSignupPeRedirectUrl] = useState("");
  const [signupInRedirectUrl, setSignupInRedirectUrl] = useState("");
  //const navigate = useNavigate();
////////////////////////////////////////////////////
  
// ESTADOS PARA LOS ERRORES DE LOS FORMULARIOS
  const [loginErrors, setLoginErrors] = useState({});
  const [signupPeErrors, setSignupPeErrors] = useState({});
  const [signupInErrors, setSignupInErrors] = useState({});
////////////////////////////////////////////////////

// FUNCIONES PARA MANEJAR LOS CAMBIOS EN LOS FORMULARIOS
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };
  const handleChangeSignupPe = (e) => {
    const { name, value } = e.target;
    setSignupPeFormData({ ...signupPeFormData, [name]: value });
  };
  const handleChangeSignupIn = (e) => {
    const { name, value } = e.target;
    setSignupInFormData({ ...signupInFormData, [name]: value });
  };
////////////////////////////////////////////////////

// FUNCIONES PARA VALIDAR LOS FORMULARIOS
  const validateLoginForm = () => {//Validar formulario de inicio de sesión
    const errors = {};

    if (!loginFormData.email.includes(".")) {
      errors.email = 'El correo electrónico debe contener el caracter "."';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
    if (!passwordRegex.test(loginFormData.password)) {
      errors.password =
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y una longitud mínima de 9 caracteres";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const validateSignupPeForm = () => {//Validar formulario de registro de persona
    const errors = {};

    if (signupPeFormData.telefono.length !== 9) {
      errors.telefono = "El teléfono debe tener exactamente 9 números";
    }

    const nombres = signupPeFormData.nombre_apellidos;

    if (nombres.length < 10) {
      errors.nombre_apellidos =
        "Debes introducir al menos un nombre y un apellido";
    }

    if (!signupPeFormData.email_signup.includes(".")) {
      errors.email_signup =
        'El correo electrónico debe contener el símbolo "."';
    }

    if (signupPeFormData.email_signup !== signupPeFormData.verif_email_signup) {
      errors.verifpass_signup = "Los correos no coinciden";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
    if (!passwordRegex.test(signupPeFormData.password_signup)) {
      errors.password_signup =
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y tener una longitud mínima de 9 caracteres";
    }

    if (
      signupPeFormData.password_signup !== signupPeFormData.verifpass_signup
    ) {
      errors.verifpass_signup = "Las contraseñas no coinciden";
    }

    setSignupPeErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const validateSignupInForm = () => {//Validar formulario de registro de institución
    const errors = {};

    if (signupInFormData.telefono_in.length !== 9) {
      errors.telefono_in = "El teléfono debe tener exactamente 9 números";
    }

    const razon = signupInFormData.razon_social;
    if (razon.length < 8) {
      errors.razon_social =
        "Debes introducir un nombre con 8 caracteres como mínimo";
    }

    if (!signupInFormData.email_in.includes(".")) {
      errors.email_in = 'El correo electrónico debe contener el símbolo "."';
    }

    if (signupInFormData.verif_email_in !== signupInFormData.email_in) {
      errors.verif_email_in = "Los correos no coinciden";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
    if (!passwordRegex.test(signupInFormData.password_in)) {
      errors.password_in =
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y tener una longitud mínima de 9 caracteres";
    }

    if (signupInFormData.password_in !== signupInFormData.verifpass_in) {
      errors.password_in = "Las contraseñas no coinciden";
    }

    if (signupInFormData.codigo_postal.length !== 5) {
      errors.codigo_postal =
        "El código postal debe tener exactamente 5 números";
    }

    setSignupInErrors(errors);
    return Object.keys(errors).length === 0;
  };
  ////////////////////////////////////////////////////////

  // FUNCIONES PARA ENVIAR LOS FORMULARIOS Y LLAMADAS A LA API
  const handleSubmitLogin = async (e) => { //Enviar formulario de inicio de sesión
    e.preventDefault();
  
    const isValid = validateLoginForm();
    if (!isValid) {
      console.log("El formulario de inicio de sesión contiene errores, por favor corríjalos.");
      return;
    }
  
    try {
  
      const response = await fetch("http://54.91.34.240/usuario/login", {
        method: "POST",
       // body: formData,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico: loginFormData.email,
          contrasena: loginFormData.password,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // obtener el texto del error
        console.error("Error en la respuesta de la API:", response.statusText, errorText);
        return;
      }
  
      const result = await response.json();
      console.log("Success:", result);
      
      Cookies.set("token", result.token);
      localStorage.setItem("correo_usuario", loginFormData.email);


      //Verificar el valor de id_tipo_usuario
      console.log("id_tipo_usuario: ", result.id_tipo_usuario)
      
      if(result.id_tipo_usuario === 1){
      setLoginRedirect(true);
      setLoginRedirectUrl("/inicio");
      }else{
        setLoginRedirect(true);
        setLoginRedirectUrl("/inicio_inst");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleSubmitSignupPe = async (e) => { //Enviar formulario de registro de persona
    e.preventDefault();
    const isValid = validateSignupPeForm();
    if (!isValid) {
      console.log("El formulario de inicio de sesión contiene errores, por favor corríjalos.");
      return;
    }
  
    try {
        
      const response = await fetch("http://54.91.34.240/usuario/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico: signupPeFormData.email_signup,
          contrasena: signupPeFormData.password_signup,
          telefono: signupPeFormData.telefono,
          nombre: signupPeFormData.nombre_apellidos,
          codigo_postal: signupPeFormData.codigo_postal,
          id_tipo_usuario: 1
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Intenta obtener el texto del error
        console.error("Error en la respuesta de la API:", response.statusText, errorText);
        return;
      }
  
      const result = await response.json();
      console.log("Success:", result);
      
      Cookies.set("token", result.token);
      localStorage.setItem("correo_usuario", signupPeFormData.email_signup);
      setSignupPeRedirect(true);
      setSignupPeRedirectUrl("/inicio");
  
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitSignupIn = async (e) => { //Enviar formulario de registro de persona
    e.preventDefault();
    const isValid = validateSignupInForm();
    if (!isValid) {
      console.log("El formulario de inicio de sesión contiene errores, por favor corríjalos.");
      return;
    }

    console.log("Datos del formulario:", signupInFormData);
  
    try {
        
      const response = await fetch("http://54.91.34.240/usuario/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico: signupInFormData.email_in,            
          contrasena: signupInFormData.password_in,
          telefono: signupInFormData.telefono_in,
          nombre: signupInFormData.razon_social,
          codigo_postal: signupInFormData.codigo_postal,
          id_tipo_usuario: 2

        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Intenta obtener el texto del error
        console.error("Error en la respuesta de la API:", response.statusText, errorText);
        return;
      }
  
      const result = await response.json();
      console.log("Success:", result);
      
      Cookies.set("token", result.token);
      setSignupInRedirect(true);
      setSignupInRedirectUrl("/inicio_inst");
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  ////////////////////////////////////////////////////////

  //LLAMADA A LA API PARA MOSTRAR INSTITUCIONES EN SELECT
  const [instituciones, setInstituciones] = useState([]);

  const obtenerInstituciones = async () => {
    try {
      const response = await fetch("http://54.91.34.240/usuario/institucion/getAll");
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      const data = await response.json();
      setInstituciones(data); //Almacena los nombre de las instituciones en el estado
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerInstituciones();
  }, []);//Se ejecuta solo una vez por eso está vacío
  ////////////////////////////////////////////////////////

  // EFECTOS PARA REDIRECCIONAR AL USUARIO
  useEffect(() => {
    if (loginRedirect) {
      window.location.href = loginRedirectUrl;
    }
  }, [loginRedirect, loginRedirectUrl]);

  useEffect(() => {
    if (signupPeRedirect) {
      window.location.href = signupPeRedirectUrl;
    }
  }, [signupPeRedirect, signupPeRedirectUrl]);

  useEffect(() => {
    if (signupInRedirect) {
      window.location.href = signupInRedirectUrl;
    }
  }, [signupInRedirect, signupInRedirectUrl]);
  ////////////////////////////////////////////////////////

// ESTADO PARA CONTROLAR SI LA CHECKBOX DE TÉRMINOS HA SIDO MARCADA
  const [termsChecked, setTermsChecked] = useState(false); //Estado para controlar si la checkbox ha sido marcada
  const [showTermsModal, setShowTermsModal] = useState(false); //Estado para controlar si se muestra el modal de términos de uso
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); //Estado para controlar si se muestra el modal de política de privacidad
////////////////////////////////////////////////////

// FUNCIONES PARA MOSTRAR LOS MODALES DE TÉRMINOS Y CONDICIONES
  const handleTermsClick = (event) => {
    event.preventDefault(); // Evita que el enlace haga scroll hacia arriba
    setShowTermsModal(true); //Mostrar modal de términos de uso
  };

  const handlePrivacyClick = (event) => {
    event.preventDefault(); // Evita que el enlace haga scroll hacia arriba
    setShowPrivacyModal(true); //Mostrar modal de política de privacidad
  };
////////////////////////////////////////////////////


  //Estructura de la página
  return (
    <div>
      <img
        src={require("../logo/logo_volta_sin_fondo_sinletras2.png")}
        alt="Logo Volta"
        className="logo"
      />
      <div className="header">
        <h1 className="title">Bienvenido a Volta </h1>
        <h2 className="subtitle">
          La APP que te ayuda a conseguir tu material escolar
        </h2>
        <h3 className="question">¿Qué podemos hacer por ti?</h3>
      </div>

      <div className="button-container">
        <button className="button" onClick={() => toggleForm("login")}>
          Identificarme
        </button>
        <button className="button" onClick={() => toggleForm("signup")}>
          Darme de alta
        </button>
        <button className="button" onClick={() => toggleForm("signupin")}>
          Censar Institución
        </button>
      </div>

      <div className="form" id="loginForm">
        <form action="#" onSubmit={handleSubmitLogin}>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Correo Electrónico*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={loginFormData.email}
              onChange={handleChangeLogin}
              maxLength="50"
              required
            />
            {loginErrors.email && (
              <p className="error-message">{loginErrors.email}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">
              Contraseña*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={loginFormData.password}
              onChange={handleChangeLogin}
              maxLength="20"
              required
            />
            {loginErrors.password && (
              <p className="error-message">{loginErrors.password}</p>
            )}
          </div>
          <div className="button-container">
            <button variant="primary" type="submit" className="button" >
              Confirmar
            </button>
          </div>
        </form>
      </div>

      <div className="form" id="signupFormPe">
        <form action="#" onSubmit={handleSubmitSignupPe}>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="telefono" className="label">
                Teléfono*
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className="input"
                value={signupPeFormData.telefono}
                onChange={handleChangeSignupPe}
                maxLength="9"
                required
              />
              {signupPeErrors.telefono && (
                <p className="error-message">{signupPeErrors.telefono}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="nombre_apellidos" className="label">
                Nombre y Apellidos*
              </label>
              <input
                type="text"
                id="nombre_apellidos"
                name="nombre_apellidos"
                className="input"
                value={signupPeFormData.nombre_apellidos}
                onChange={handleChangeSignupPe}
                maxLength="35"
                required
              />
              {signupPeErrors.nombre_apellidos && (
                <p className="error-message">
                  {signupPeErrors.nombre_apellidos}
                </p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="email_signup" className="label">
                Correo Electrónico*
              </label>
              <input
                type="email"
                id="email_signup"
                name="email_signup"
                className="input"
                value={signupPeFormData.email_signup}
                onChange={handleChangeSignupPe}
                maxLength="35"
                required
              />
              {signupPeErrors.email_signup && (
                <p className="error-message">{signupPeErrors.email_signup}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="verif_email_signup" className="label">
                Verifique correo*
              </label>
              <input
                type="email"
                id="verif_mail_signup"
                name="verif_email_signup"
                className="input"
                value={signupPeFormData.verif_email_signup}
                onChange={handleChangeSignupPe}
                maxLength="35"
                required
              />
              {signupPeErrors.verif_email_signup && (
                <p className="error-message">
                  {signupPeErrors.verif_email_signup}
                </p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="password_signup" className="label">
                Contraseña*
              </label>
              <input
                type="password"
                id="password_signup"
                name="password_signup"
                className="input"
                value={signupPeFormData.password_signup}
                onChange={handleChangeSignupPe}
                maxLength="20"
                required
              />
              {signupPeErrors.password_signup && (
                <p className="error-message">
                  {signupPeErrors.password_signup}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="verifpass_signup" className="label">
                Verifique Contraseña*
              </label>
              <input
                type="password"
                id="verifpass_signup"
                name="verifpass_signup"
                className="input"
                value={signupPeFormData.verifpass_signup}
                onChange={handleChangeSignupPe}
                maxLength="20"
                required
              />
              {signupPeErrors.verifpass_signup && (
                <p className="error-message">
                  {signupPeErrors.verifpass_signup}
                </p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="institucion" className="label">
                Institución
              </label>
              <select
                id="institucion"
                name="institucion"
                className="input"
                value={signupPeFormData.institucion}
                onChange={handleChangeSignupPe}
              >
                <option value="">Selecciona una institución</option>
                {instituciones.map((institucion) => (//Mapea las instituciones para mostrarlas en el select
                  <option key={institucion.id} value={institucion.nombre}>
                      {institucion.nombre}
                </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <input
              type="checkbox"
              id="terms"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              required
            />
            <label htmlFor="terms">
              Acepto los{" "}
              <button
                onClick={handleTermsClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                términos de uso
              </button>{" "}
              y la{" "}
              <button
                onClick={handlePrivacyClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                política de privacidad
              </button>
            </label>
          </div>

          {/* Modal para condiciones de uso */}
          {showTermsModal && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setShowTermsModal(false)}
                >
                  &times;
                </span>
                {/* Contenido de las condiciones de uso */}
                Condiciones de uso de la aplicación Volta Aceptación de las
                condiciones: Al utilizar la aplicación Volta, aceptas cumplir
                con los términos y condiciones establecidos en este documento.
                Si no estás de acuerdo con alguna parte de estas condiciones, te
                recomendamos que no utilices la aplicación. Uso autorizado: La
                aplicación Volta está destinada únicamente para su uso personal
                y no comercial. No debes utilizar la aplicación de ninguna
                manera que pueda causar daño a la aplicación o a terceros.
                Registro: Al registrarte en la aplicación, te comprometes a
                proporcionar información veraz, precisa y actualizada sobre ti
                mismo según sea necesario en el formulario de registro.
                Privacidad: Respetamos tu privacidad y protegemos tus datos
                personales de acuerdo con nuestra política de privacidad. Sin
                embargo, al utilizar la aplicación, aceptas que cierta
                información sobre ti pueda ser recopilada y utilizada de acuerdo
                con nuestra política de privacidad. Seguridad de la cuenta: Eres
                responsable de mantener la confidencialidad de tu contraseña y
                de todas las actividades que ocurran en tu cuenta. Debes
                notificarnos de inmediato cualquier uso no autorizado de tu
                cuenta o cualquier otra violación de seguridad. Contenido
                generado por el usuario: Al utilizar la aplicación, puedes
                generar contenido, como publicaciones, comentarios o mensajes.
                Te comprometes a no publicar contenido que sea difamatorio,
                obsceno, ilegal o que infrinja los derechos de autor de
                terceros. Propiedad intelectual: Todos los derechos de propiedad
                intelectual relacionados con la aplicación y su contenido,
                incluidos los derechos de autor, marcas comerciales y patentes,
                son propiedad de Volta o de sus licenciantes. No puedes
                reproducir, distribuir o utilizar de ninguna manera el contenido
                de la aplicación sin nuestro consentimiento expreso por escrito.
                Modificaciones: Nos reservamos el derecho de modificar o
                suspender la aplicación, o cualquier parte de ella, en cualquier
                momento y sin previo aviso. También nos reservamos el derecho de
                modificar estas condiciones de uso en cualquier momento. Se te
                notificará cualquier cambio en estas condiciones a través de la
                aplicación. Limitación de responsabilidad: La aplicación se
                proporciona "tal cual" y "según disponibilidad". No garantizamos
                que la aplicación sea segura, libre de errores o esté libre de
                virus u otros componentes dañinos. En la medida máxima permitida
                por la ley, no seremos responsables de ningún daño directo,
                indirecto, incidental, especial o consecuente que surja del uso
                o la imposibilidad de uso de la aplicación.
              </div>
            </div>
          )}

          {/* Modal para política de privacidad */}
          {showPrivacyModal && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  &times;
                </span>
                {/* Contenido de la política de privacidad */}
                Política de Privacidad de Volta Última actualización:
                [22/04/2024] Volta respeta y protege su privacidad. Esta
                Política de Privacidad describe cómo recopilamos, utilizamos y
                protegemos la información personal que usted proporciona en
                nuestra aplicación (en adelante, "Servicio"). 1. Información que
                Recopilamos Información de Registro: Cuando se registra en
                nuestro Servicio, podemos solicitar cierta información personal,
                como su nombre, dirección de correo electrónico, número de
                teléfono y otros datos de contacto. Información de Uso:
                Recopilamos información sobre cómo utiliza nuestro Servicio,
                como sus interacciones con la aplicación, las páginas que visita
                y las acciones que realiza. 2. Uso de la Información Utilizamos
                la información recopilada para: Proporcionar y mantener nuestro
                Servicio. Personalizar su experiencia y ofrecer contenido y
                funciones específicos para usted. Comprender cómo interactúa con
                nuestro Servicio y mejorar su funcionalidad y rendimiento.
                Comunicarnos con usted, responder a sus consultas y proporcionar
                asistencia al cliente. Cumplir con nuestras obligaciones legales
                y proteger nuestros derechos. 3. Compartir de la Información No
                compartimos su información personal con terceros, excepto en las
                siguientes circunstancias: Con su consentimiento. Cuando sea
                necesario para proporcionar nuestros servicios y cumplir con
                nuestras obligaciones contractuales. Cuando esté permitido o
                requerido por la ley, como en respuesta a una orden judicial o
                solicitud de una autoridad gubernamental. 4. Seguridad de la
                Información Tomamos medidas razonables para proteger la
                información personal contra accesos no autorizados, divulgación,
                alteración o destrucción. Sin embargo, tenga en cuenta que
                ninguna transmisión de datos por Internet o método de
                almacenamiento electrónico es 100% seguro. 5. Cambios en esta
                Política de Privacidad Podemos actualizar esta Política de
                Privacidad periódicamente para reflejar cambios en nuestras
                prácticas de privacidad. Le notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página. 6.
                Contacto Si tiene alguna pregunta o inquietud sobre esta
                Política de Privacidad o nuestras prácticas de privacidad, no
                dude en contactarnos a través de [sarapdelpi@gmail.com].
              </div>
            </div>
          )}

          <div className="button-container">
            {/* <Link to="inicio"> <button  variant="primary"type="submit" className="button">Dar de alta</button></Link>*/}
            {/* {redirect ? <Link to="/inicio" className="button">Dar de alta</Link> : <button variant="primary" type="submit" className="button">Dar de alta</button>}*/}
            <button variant="primary" type="submit" className="button">
              Dar de alta
            </button>
          </div>
        </form>
      </div>

      <div className="form" id="signupFormIn">
        <form action="#" onSubmit={handleSubmitSignupIn}>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="telefono_in" className="label">
                Teléfono*
              </label>
              <input
                type="tel"
                id="telefono_in"
                name="telefono_in"
                className="input"
                value={signupInFormData.telefono_in}
                onChange={handleChangeSignupIn}
                maxLength="9"
                required
              />
              {signupInErrors.telefono_in && (
                <p className="error-message">{signupInErrors.telefono_in}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="razon_social" className="label">
                Nombre o razón social*
              </label>
              <input
                type="text"
                id="razon_social"
                name="razon_social"
                className="input"
                value={signupInFormData.razon_social}
                onChange={handleChangeSignupIn}
                maxLength="35"
                required
              />
              {signupInErrors.razon_social && (
                <p className="error-message">{signupInErrors.razon_social}</p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="email_in" className="label">
                Correo Electrónico*
              </label>
              <input
                type="email"
                id="email_in"
                name="email_in"
                className="input"
                value={signupInFormData.email_in}
                onChange={handleChangeSignupIn}
                maxLength="35"
                required
              />
              {signupInErrors.email_in && (
                <p className="error-message">{signupInErrors.email_in}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="verif_email_in" className="label">
                Verifique correo*
              </label>
              <input
                type="verif_email"
                id="verif_email_in"
                name="verif_email_in"
                className="input"
                value={signupInFormData.verif_email_in}
                onChange={handleChangeSignupIn}
                maxLength="35"
                required
              />
              {signupInErrors.verif_email_in && (
                <p className="error-message">{signupInErrors.verif_email_in}</p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="password_in" className="label">
                Contraseña*
              </label>
              <input
                type="password"
                id="password_in"
                name="password_in"
                className="input"
                value={signupInFormData.password_in}
                onChange={handleChangeSignupIn}
                maxLength="20"
                required
              />
              {signupInErrors.password_in && (
                <p className="error-message">{signupInErrors.password_in}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="verifpass_in" className="label">
                Verifique Contraseña*
              </label>
              <input
                type="password"
                id="verifpass_in"
                name="verifpass_in"
                className="input"
                value={signupInFormData.verifpass_in}
                onChange={handleChangeSignupIn}
                maxLength="20"
                required
              />
              {signupInErrors.verifpass_in && (
                <p className="error-message">{signupInErrors.verifpass_in}</p>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="form-group">
              <label htmlFor="codigo_postal" className="label">
                Código postal*
              </label>
              <input
                type="text"
                id="codigo_postal"
                name="codigo_postal"
                className="input"
                value={signupInFormData.codigo_postal}
                onChange={handleChangeSignupIn}
                maxLength="35"
              />
              {signupInErrors.codigo_postal && (
                <p className="error-message">{signupInErrors.codigo_postal}</p>
              )}
            </div>
          </div>
          <div>
            <input 
            type="checkbox" 
            id="terms"
            checked={termsChecked}
            onChange={() => setTermsChecked(!termsChecked)}
            required />
            <label htmlFor="terms">
              Acepto los{" "}
              <button
                onClick={handleTermsClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                términos de uso
              </button>{" "}
              y la{" "}
              <button
                onClick={handlePrivacyClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                política de privacidad
              </button>
            </label>
          </div>

          {/* Modal para condiciones de uso */}
          {showTermsModal && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setShowTermsModal(false)}
                >
                  &times;
                </span>
                {/* Contenido de las condiciones de uso */}
                Condiciones de uso de la aplicación Volta Aceptación de las
                condiciones: Al utilizar la aplicación Volta, aceptas cumplir
                con los términos y condiciones establecidos en este documento.
                Si no estás de acuerdo con alguna parte de estas condiciones, te
                recomendamos que no utilices la aplicación. Uso autorizado: La
                aplicación Volta está destinada únicamente para su uso personal
                y no comercial. No debes utilizar la aplicación de ninguna
                manera que pueda causar daño a la aplicación o a terceros.
                Registro: Al registrarte en la aplicación, te comprometes a
                proporcionar información veraz, precisa y actualizada sobre ti
                mismo según sea necesario en el formulario de registro.
                Privacidad: Respetamos tu privacidad y protegemos tus datos
                personales de acuerdo con nuestra política de privacidad. Sin
                embargo, al utilizar la aplicación, aceptas que cierta
                información sobre ti pueda ser recopilada y utilizada de acuerdo
                con nuestra política de privacidad. Seguridad de la cuenta: Eres
                responsable de mantener la confidencialidad de tu contraseña y
                de todas las actividades que ocurran en tu cuenta. Debes
                notificarnos de inmediato cualquier uso no autorizado de tu
                cuenta o cualquier otra violación de seguridad. Contenido
                generado por el usuario: Al utilizar la aplicación, puedes
                generar contenido, como publicaciones, comentarios o mensajes.
                Te comprometes a no publicar contenido que sea difamatorio,
                obsceno, ilegal o que infrinja los derechos de autor de
                terceros. Propiedad intelectual: Todos los derechos de propiedad
                intelectual relacionados con la aplicación y su contenido,
                incluidos los derechos de autor, marcas comerciales y patentes,
                son propiedad de Volta o de sus licenciantes. No puedes
                reproducir, distribuir o utilizar de ninguna manera el contenido
                de la aplicación sin nuestro consentimiento expreso por escrito.
                Modificaciones: Nos reservamos el derecho de modificar o
                suspender la aplicación, o cualquier parte de ella, en cualquier
                momento y sin previo aviso. También nos reservamos el derecho de
                modificar estas condiciones de uso en cualquier momento. Se te
                notificará cualquier cambio en estas condiciones a través de la
                aplicación. Limitación de responsabilidad: La aplicación se
                proporciona "tal cual" y "según disponibilidad". No garantizamos
                que la aplicación sea segura, libre de errores o esté libre de
                virus u otros componentes dañinos. En la medida máxima permitida
                por la ley, no seremos responsables de ningún daño directo,
                indirecto, incidental, especial o consecuente que surja del uso
                o la imposibilidad de uso de la aplicación.
              </div>
            </div>
          )}

          {/* Modal para política de privacidad */}
          {showPrivacyModal && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  &times;
                </span>
                {/* Contenido de la política de privacidad */}
                Política de Privacidad de Volta Última actualización:
                [22/04/2024] Volta respeta y protege su privacidad. Esta
                Política de Privacidad describe cómo recopilamos, utilizamos y
                protegemos la información personal que usted proporciona en
                nuestra aplicación (en adelante, "Servicio"). 1. Información que
                Recopilamos Información de Registro: Cuando se registra en
                nuestro Servicio, podemos solicitar cierta información personal,
                como su nombre, dirección de correo electrónico, número de
                teléfono y otros datos de contacto. Información de Uso:
                Recopilamos información sobre cómo utiliza nuestro Servicio,
                como sus interacciones con la aplicación, las páginas que visita
                y las acciones que realiza. 2. Uso de la Información Utilizamos
                la información recopilada para: Proporcionar y mantener nuestro
                Servicio. Personalizar su experiencia y ofrecer contenido y
                funciones específicos para usted. Comprender cómo interactúa con
                nuestro Servicio y mejorar su funcionalidad y rendimiento.
                Comunicarnos con usted, responder a sus consultas y proporcionar
                asistencia al cliente. Cumplir con nuestras obligaciones legales
                y proteger nuestros derechos. 3. Compartir de la Información No
                compartimos su información personal con terceros, excepto en las
                siguientes circunstancias: Con su consentimiento. Cuando sea
                necesario para proporcionar nuestros servicios y cumplir con
                nuestras obligaciones contractuales. Cuando esté permitido o
                requerido por la ley, como en respuesta a una orden judicial o
                solicitud de una autoridad gubernamental. 4. Seguridad de la
                Información Tomamos medidas razonables para proteger la
                información personal contra accesos no autorizados, divulgación,
                alteración o destrucción. Sin embargo, tenga en cuenta que
                ninguna transmisión de datos por Internet o método de
                almacenamiento electrónico es 100% seguro. 5. Cambios en esta
                Política de Privacidad Podemos actualizar esta Política de
                Privacidad periódicamente para reflejar cambios en nuestras
                prácticas de privacidad. Le notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página. 6.
                Contacto Si tiene alguna pregunta o inquietud sobre esta
                Política de Privacidad o nuestras prácticas de privacidad, no
                dude en contactarnos a través de [sarapdelpi@gmail.com].
              </div>
            </div>
          )}

          <div className="button-container">
            {/*Link to="/inicio"><button  variant="primary" type="submit" className="button">Censar Institución</button></Link>*/}
            {/*{redirect ? <Link to="/inicio_inst" className="button">Censar Institución</Link> : <button variant="primary" type="submit" className="button">Censar Institución</button>}*/}
            <button variant="primary" type="submit" className="button">
              Censar Institución
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PagRegistros2;
