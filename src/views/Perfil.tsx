import { Component, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ToastContainer, Toast } from 'react-bootstrap';
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice';
import EditableInput from '../common/editableInput/EditableInput';
import * as dayjs from 'dayjs';
import { getMe, setMe } from '../services/apiCalls';

export const Perfil = ( props:any ) => {
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
    const [perfilInicial, setPerfilInicial] = useState({...dueño, pass:'***'});
    const [perfil, setPerfil] = useState({...dueño, pass:'***'});
    const [guardable, setGuardable]= useState(true);
    const emailRegex = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,15})+$";
    let now = dayjs();

    useEffect(()=>{
        if(props.savePerfilProps.savePerfil){
            if(guardable)save();
            else {
                props.messageProps.setErrMessage('Alguno de los datos no era valido y finalmente se ha descartado');
            cancel();
        }
        }
    },[props.savePerfilProps.guardarPerfil])

    useEffect(()=>{
        getMe(dueño.token)
        .then((res)=>{
            if(res.status===200)return;
            if(res.response.status===500)logout('expirado');
        });
    },[]);
    
    const _setPerfil = (nombre:string,elem:string) => {
        setPerfil({...perfil, [nombre]:elem});
    }
    const edit = () => {
        _setPerfil('pass','');
        setGrupoClass('grupo-edit');
        passInput.current.placeholder='mantener contraseña';
        setEditPerfil(true);
        props.savePerfilProps.setEditarPerfil(true);
    }
    const cancel = () => {
        setGrupoClass('grupo');
        setPerfil({
            ...perfilInicial
        });
        _setPerfil('pass','***');
        setEditPerfil(false);
        props.savePerfilProps.setEditarPerfil(false);
        
    }
    const save = () => {
        setMe(perfil).
        then((res:any)=>{
            if (res.status === 200) {
                props.messageProps.setSuccessMessage('Usuario actualizado correctamente');
                dispatch(setDueño(perfil));
            }
            else console.log(res) // falta tratarlo
        });
        _setPerfil('pass','***');
        setGrupoClass('grupo');
        props.savePerfilProps.setGuardarPerfil(false);
        props.savePerfilProps.setEditarPerfil(false);
        setEditPerfil(false);
        props.messageProps.setSuccessMessage('Datos guardados correctamente');
    }
    const logout = (status:string) => {
        dispatch(resetDueño());
        if(status === 'expirado') props.messageProps.setErrMessage('Sesión expirada, debe hacer login de nuevo');
        if(status === 'correcto') props.messageProps.setSuccessMessage('Sesión cerrada correctamente');
        setTimeout(() => {
            navigate('/');
        }, 2000);
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
        <div className='espaciado'>
            <h2>Perfil</h2>
            {dueño.token !== '' && (
                <div className='espaciado'>
                    {!editPerfil?(
                        <div>
                            <Button className='espaciado' variant='primary' onClick={()=>edit()}>Editar</Button>
                        </div>
                    ):(
                        <div>
                            <Button className='espaciado' variant='success' disabled={!guardable} onClick={()=>{
                                save();
                            }}>Guardar</Button>
                            <Button className='espaciado' variant='danger' onClick={()=>{
                                cancel();
                            }}>Cancelar</Button>
                        </div>
                    )}
                    <div className={grupoClass}>
                        <EditableInput label='Nombre' nombre='nombre' editFlag={editPerfil} value={perfil.nombre} set={_setPerfil} ref={nombreInput} required/>
                        <EditableInput label='Apellido' nombre='apellido' editFlag={editPerfil} value={perfil.apellido} set={_setPerfil} ref={apellidoInput} required/>
                        <EditableInput label='Teléfono' nombre='telefono' editFlag={editPerfil} value={perfil.telefono} set={_setPerfil} ref={telefonoInput} required/>
                        <EditableInput label='Email' nombre='email' editFlag={editPerfil} value={perfil.email} ref={emailInput} set={_setPerfil} pattern={emailRegex} required/>
                        <EditableInput visibleFlag type='password' label='Contraseña' nombre='pass' editFlag={editPerfil} value={perfil.pass} set={_setPerfil} ref={passInput}/>
                    </div>
                    <div>
                        <Button className='espaciado' variant='danger' onClick={()=>logout('correcto')}>Logout</Button>
                    </div>
                </div>
                )}
        </div>
    )
}