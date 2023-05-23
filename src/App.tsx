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
import { getMe } from './services/apiCalls';
import { selectMe, resetDueño } from './app/dueñoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Toast, ToastContainer } from 'react-bootstrap';
import * as dayjs from 'dayjs';

function App(): JSX.Element {
  const [editarPerfil,setEditarPerfil]= useState<boolean>(false);
  const [guardarPerfil,setGuardarPerfil]= useState<boolean>(false);
  const dueño = useSelector(selectMe);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage,setSuccessMessage] = useState<string>('');
  const [errMessage,setErrMessage] = useState<string>('');
  const messageProps = {setSuccessMessage, setErrMessage};
  const [visibleSuccess,setVisibleSuccess] = useState(false);
  const [visibleErr,setVisibleErr] = useState(false);
  const savePerfilProps = {editarPerfil, setEditarPerfil, guardarPerfil, setGuardarPerfil};
  let now = dayjs();

  const logout = (status:string) => {
    dispatch(resetDueño());
    if(status === 'expirado') setErrMessage('Sesión expirada, debe hacer login de nuevo');
    if(status === 'correcto') setSuccessMessage('Sesión cerrada correctamente');
    setTimeout(() => {
        navigate('/');
    }, 2000);
  }
  useEffect(()=>{
    getMe(dueño.dueño.token)
    .then((res)=>{
        if(res.status===200)return;
        if(res.response.status===500)logout('expirado');
    });
  },[]);
  useEffect(()=>{
    if( errMessage !== '')setVisibleErr(true);
  },[errMessage]);
  useEffect(()=>{
    if( successMessage !== '')setVisibleSuccess(true);
  },[successMessage]);

  return (
    <>
      <Navig savePerfilProps={savePerfilProps}></Navig>
      <Routes>
        <Route element={<Home></Home>} path='/'></Route>
        <Route element={<Auth page='1' messageProps={messageProps}></Auth>} path='/auth/login'></Route>
        <Route element={<Auth page='2' messageProps={messageProps}></Auth>} path='/auth/registro'></Route>
        <Route element={<Perfil 
          messageProps={messageProps}
          savePerfilProps= {savePerfilProps}
          >
          </Perfil>} path='/perfil/usuario'></Route>
        <Route element={<Dueño></Dueño>} path='/perfil/dueño'></Route>
      </Routes>
      <ToastContainer position='bottom-center'>
            <Toast onClose={() => {
                setVisibleErr(false);
                setErrMessage('');
                }} show={visibleErr} delay={3000} autohide>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">El teu Gos, el Nostre Gos</strong>
                    <small>{now.format('hh:mm a')}</small>
                </Toast.Header>
                <Toast.Body className='error'>Error: {errMessage}</Toast.Body>
            </Toast>
            <Toast onClose={() => {
                setVisibleSuccess(false);
                setSuccessMessage('');
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
