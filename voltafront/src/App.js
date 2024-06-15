import './App.css';
import React from "react";
import {Route, Routes} from "react-router-dom";
import PagRegistros2 from './paginas/pag_registros2';
import InicioPe from './paginas/inicio_pe';
import InicioInst from './paginas_inst/inicio_inst';
import DonarPe from './paginas/donar_pe';
import VerObjPe from './paginas/ver_obj_pe';
import VerObjInst from './paginas_inst/ver_obj_inst';
import FavoritosPe from './paginas/favoritos_pe';
import BuzonPe from './paginas/buzon_pe';
import BuzonInst from './paginas_inst/buzon_inst';
import MiEspacioPe from './paginas/mi_espacio_pe';
import PonerVentaPe from './paginas/poner_venta_pe';
import TransferenciaPuntos from './paginas/transferencia_puntos';
import ChatPe from './paginas/chat_pe';
import ChatInst from './paginas_inst/chat_inst';
import MiEspacioInst from './paginas_inst/mi_espacio_inst';

function App() {
  return (
    <React.Fragment>
                <Routes>
                        <Route path="/" element={<PagRegistros2 name="home"/>} />
                        <Route path="/inicio" element={<InicioPe/>} />
                        <Route path="/donar" element={<DonarPe />} />
                        <Route path="/buzon" element={<BuzonPe />} />
                        <Route path="/buzon_inst" element={<BuzonInst />} />
                        <Route path="/favoritos" element={<FavoritosPe />} />
                        <Route path="/mi_espacio" element={<MiEspacioPe />} />
                        <Route path="/mi_espacio_inst" element={<MiEspacioInst />} />
                        <Route path="/ver_objeto/:prod_id" element={<VerObjPe />} />
                        <Route path="/ver_objeto_inst/:prod_id" element={<VerObjInst />} />
                        <Route path="/poner_venta" element={<PonerVentaPe />} />
                        <Route path="/transferencia_puntos" element={<TransferenciaPuntos />} />
                        <Route path="/chat" element={<ChatPe />} />
                        <Route path="/chat_inst" element={<ChatInst />} />
                        <Route path="/inicio_inst" element={<InicioInst />} />


                        <Route path="*" element={<div>404</div>}/>

                </Routes>
      </React.Fragment>
  );
}

export default App;