import { Component, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ToastContainer, Toast } from 'react-bootstrap';
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice';
import EditableInput from '../common/editableInput/EditableInput';
import * as dayjs from 'dayjs';

export const Perfil = () => {
    const navigate = useNavigate();
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    const [editPerfil, setEditPerfil] = useState(false);
    const [grupoClass, setGrupoClass]= useState('grupo');
    const nombreInput:any=useRef();
    const apellidoInput:any=useRef();
    const telefonoInput:any=useRef();
    const emailInput:any=useRef();
    const passInput:any=useRef();
    const [perfilInicial, setPerfilInicial] = useState({...dueño.dueño, pass:'***'});
    const [perfil, setPerfil] = useState({...dueño.dueño, pass:'***'});
    const [guardable, setGuardable]= useState(true);
    const emailRegex = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,15})+$";

    const [successMessage,setSuccessMessage] = useState('');
    const [errMessage,setErrMessage] = useState('');
    const [visibleSuccess,setVisibleSuccess] = useState(false);
    const [visibleErr,setVisibleErr] = useState(false);
    let now = dayjs();

    useEffect(()=>{
        if( errMessage !== '')setVisibleErr(true);
    },[errMessage]);
    useEffect(()=>{
        if( successMessage !== '')setVisibleSuccess(true);
    },[successMessage]);
    // useEffect(()=>{console.log(nombreInput)},[]);
    const _setPerfil = (nombre:string,elem:string) => {
        setPerfil({...perfil, [nombre]:elem});
    }
    const edit = () => {
        _setPerfil('pass','');
        setGrupoClass('grupo-edit');
        passInput.current.placeholder='mantener contraseña';
        setEditPerfil(true);
    }
    const cancel = () => {
        setGrupoClass('grupo');
        setPerfil({
            ...perfilInicial
        });
    }
    const save = () => {
        setGrupoClass('grupo');
        setSuccessMessage('Datos guardados correctamente');
    }
    useEffect(()=>{
        if(
            perfil.nombre!=='' &&
            perfil.apellido!=='' &&
            perfil.telefono!=='' &&
            perfil.email.match(emailRegex)
        ) setGuardable(true);
        else setGuardable(false);
    },[perfil])
    return (
        <div>
            <h2>Perfil</h2>
            {dueño.dueño.token !== '' && (
                <div className='espaciado'>
                    {!editPerfil?(
                        <div>
                            <Button className='espaciado' variant='primary' onClick={()=>edit()}>Editar</Button>
                        </div>
                    ):(
                        <div>
                            <Button className='espaciado' variant='success' disabled={!guardable} onClick={()=>{
                                save();
                                setEditPerfil(false);
                            }}>Guardar</Button>
                            <Button className='espaciado' variant='danger' onClick={()=>{
                                cancel();
                                setEditPerfil(false);
                            }}>Cancelar</Button>
                        </div>
                    )}
                    <div className={grupoClass}>
                        <EditableInput label='Nombre' nombre='nombre' editFlag={editPerfil} value={perfil.nombre} set={_setPerfil} ref={nombreInput} required/>
                        <EditableInput label='Apellido' nombre='apellido' editFlag={editPerfil} value={perfil.apellido} set={_setPerfil} ref={apellidoInput} required/>
                        <EditableInput label='Teléfono' nombre='telefono' editFlag={editPerfil} value={perfil.telefono} set={_setPerfil} ref={telefonoInput} required/>
                        <EditableInput label='Email' nombre='email' editFlag={editPerfil} value={perfil.email} ref={emailInput} set={_setPerfil} pattern={emailRegex} required/>
                        <EditableInput label='Contraseña' nombre='pass' editFlag={editPerfil} value={perfil.pass} set={_setPerfil} ref={passInput}/>
                    </div>
                    <div>
                        <Button className='espaciado' variant='danger' onClick={()=>{
                            dispatch(resetDueño());
                            navigate('/');
                        }}>Logout</Button>
                    </div>
                </div>
                )}
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
                <Toast.Body>Exito: {successMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
        </div>
    )
}