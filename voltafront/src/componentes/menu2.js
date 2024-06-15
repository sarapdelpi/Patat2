import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../logo/logo_volta_sin_fondo_sinletras2.png'; // Importa  logo
import {FaBars, FaTimes} from 'react-icons/fa'; //Importa icono de hamburguesa e icono de cerrar
import {Link} from 'react-router-dom';


const NavBar = () =>{
    const [click, setClick] = useState(false);

    const ChangeClick = () => {
        setClick(!click);
    }


    return(
        <>
            <NavbarContainer>
                <NavbarWrapper>
                    <IconLogo as={Link} to="/inicio">
                        <img className='logo' src={logo} alt="logo" />
                    </IconLogo>

                    <IconLogoMobile onClick={() => ChangeClick()}>
                        {
                            click ? <FaTimes /> : <FaBars />
                        }
                    </IconLogoMobile>

                    <Menu click={click}>
                        <MenuItem onClick={() => ChangeClick()}>
                            <MenuItemLink as={Link} to ="/donar">Donar</MenuItemLink>
                        </MenuItem>
                        <MenuItem onClick={() => ChangeClick()}>
                            <MenuItemLink as={Link} to ="/buzon">Buzón</MenuItemLink>
                        </MenuItem>
                        <MenuItem onClick={() => ChangeClick()}>
                            <MenuItemLink as={Link} to="/favoritos">Favoritos</MenuItemLink>
                        </MenuItem>
                        <MenuItem onClick={() => ChangeClick()}>
                            <MenuItemLink as={Link} to="/mi_espacio">Mi espacio</MenuItemLink>
                        </MenuItem>
                    </Menu>
                </NavbarWrapper>
            </NavbarContainer>
        </>
    )

}

export default NavBar;


//Estilos para el menu
const NavbarContainer = styled.div`
    width: 100%;
    height: 80px;
    position: sticky;
    top: 0;
    z-index: 99;
    background-color: #4CAF50;
`;


const NavbarWrapper = styled.div`
    margin: auto;
    width: 100%;
    max-width: 1300px;
    height: 100%;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;


const IconLogo = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.2rem;
    color: #F9F9F9;

    .logo{
        width: 80px;
        height: 80px;
        cursor: pointer;
        margin-bottom: 25px;
    }
`;

const Menu = styled.ul`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 960px){
        width: 100%;
        height: 90vh;
        position: absolute;
        top: 80px;
        left: ${({click}) => (click ? 0 : '-110%')};
        flex-direction: column;
        transition: 0.5s all ease-in;
        background-color: #4CAF50;
    }
`;

const MenuItem = styled.li`
    height: 100%;
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 400;
    margin-bottom: 25px;

    &:hover{
        background-color: #3E8E41;
        border-bottom: 0.3rem solid #F9F9F9;
        transition: 0.4s ease;
        cursor: pointer;
    }

    @media screen and (max-width: 960px){
        width: 100%;
        height: 70px;
    
    }
`;

const MenuItemLink = styled.a`
    text-decoration: none;
    color: #F9F9F9;
`;

const IconLogoMobile = styled.div`
    display: none;
    cursor: pointer;

    @media screen and (max-width: 960px){
        display: flex;
        color: # F9F9F9;
        margin-right: 1rem;
    }
`;