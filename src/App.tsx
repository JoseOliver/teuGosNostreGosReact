import './App.css';
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { Navig } from './common/navbar/Navbar';
import { Home } from './views/home';
import { Perfil } from './views/Perfil';
import Dueño from './views/dueño'
import Auth from './views/auth';
import { useEffect, useState } from 'react';
import { getMe, setMe } from './services/apiCalls';
import { selectMe, setDueño, resetDueño } from './app/dueñoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Toast, ToastContainer } from 'react-bootstrap';
import * as dayjs from 'dayjs';
import Perro from './common/perro/Perro';
import NewPerro from './common/perro/NewPerro';
import Estancia from './common/estancia/Estancia';
import NewEstancia from './common/estancia/NewEstancia';

function App(): JSX.Element {
  const [editarPerfil,setEditarPerfil]= useState<boolean>(false);
  const [guardarPerfil,setGuardarPerfil]= useState<boolean>(false);
  const [editarPerro,setEditarPerro]= useState<boolean>(false);
  const [guardarPerro,setGuardarPerro]= useState<boolean>(false);
  const dueño = useSelector(selectMe);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage,setSuccessMessage] = useState<string>('');
  const [errMessage,setErrMessage] = useState<string>('');
  const messageProps = {setSuccessMessage, setErrMessage};
  const [visibleSuccess,setVisibleSuccess] = useState(false);
  const [visibleErr,setVisibleErr] = useState(false);
  const savePerfilProps = {editarPerfil, setEditarPerfil, guardarPerfil, setGuardarPerfil};
  const savePerroProps ={editarPerro, setEditarPerro, guardarPerro, setGuardarPerro};
  let now = dayjs();

  const logout = (status:string) => {
    dispatch(resetDueño());
    if(status === 'expirado') {
      setErrMessage('Sesión expirada, debe hacer login de nuevo');
    }
    if(status === 'correcto'){
      setSuccessMessage('Sesión cerrada correctamente');
      setTimeout(() => {
          navigate('/');
      }, 2000);
    }
  }
  useEffect(()=>{
    if(!dueño.token){
      dispatch(resetDueño());
      return;
    }
    getMe(dueño.token)
    .then((res:any)=>{
      if(!(res.status===200))
      logout('expirado');
    });
  },[dueño]);
  
  useEffect(()=>{
    if( errMessage !== '')setVisibleErr(true);
  },[errMessage]);
  useEffect(()=>{
    if( successMessage !== '')setVisibleSuccess(true);
  },[successMessage]);

  return (
    <>
      <Navig savePerfilProps={savePerfilProps} savePerroProps={savePerroProps}></Navig>
      <Routes>
        <Route element={<Home></Home>} path='/'></Route>
        <Route element={<Auth page='1' messageProps={messageProps}></Auth>} path='/auth/login'></Route>
        <Route element={<Auth page='2' messageProps={messageProps}></Auth>} path='/auth/registro'></Route>
        <Route element={<Perfil messageProps={messageProps} savePerfilProps= {savePerfilProps}></Perfil>} path='/perfil/usuario'></Route>
        <Route element={<Dueño messageProps={messageProps}></Dueño>} path='/perfil/dueño'></Route>
        <Route element={<Perro messageProps={messageProps} savePerroProps={savePerroProps} ></Perro>} path='/perfil/dueño/perro'></Route>
        <Route element={<NewPerro messageProps={messageProps}></NewPerro>} path='/perfil/dueño/nuevo-perro'></Route>
        <Route element={<Estancia></Estancia>} path='/perfil/dueño/estancia'></Route>
        <Route element={<NewEstancia messageProps={messageProps}></NewEstancia>} path='/perfil/dueño/nueva-estancia'></Route>
      </Routes>
      <ToastContainer position='bottom-center'>
            <Toast onClose={() => {
                setVisibleErr(false);
                setTimeout(()=>setErrMessage(''),500);
                }} show={visibleErr} delay={3000} autohide>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">El teu Gos, el Nostre Gos</strong>
                    <small>{now.format('hh:mm a')}</small>
                </Toast.Header>
                <Toast.Body className='error'>Aviso: {errMessage}</Toast.Body>
            </Toast>
            <Toast onClose={() => {
                setVisibleSuccess(false);
                setTimeout(()=>setSuccessMessage(''),500);
                }} show={visibleSuccess} delay={3000} autohide>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">El teu Gos, el Nostre Gos</strong>
                    <small>{now.format('hh:mm a')}</small>
                </Toast.Header>
                <Toast.Body className='exito'>Exito: {successMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
    </>
  )
}

export default App
