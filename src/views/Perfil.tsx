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
    const dueño = useSelector(selectMe); // hook que contiene el perfil de usuario y las caracteristicas del rol dueño
    const dispatch = useDispatch();
    const [editPerfil, setEditPerfil] = useState(false); // hook booleano para saber el estado de edicion del perfil
    const [grupoClass, setGrupoClass]= useState('grupo'); // hook que determina la clase que envuelve al div del perfil, para poder aplicar los cambios visuales. Cambia entre 'grupo' por defecto y 'grupo-edit' cuando esta siendo editado
    // - hooks de referencia de los inputs
    const nombreInput:any=useRef();
    const apellidoInput:any=useRef();
    const telefonoInput:any=useRef();
    const emailInput:any=useRef();
    const passInput:any=useRef();
    // -
    const [perfilInicial, setPerfilInicial] = useState({...dueño, pass:'***'}); // hook de estado de las variables del perfil. Este es un estado previo a realizar cambios, que se utiliza para reestablecer los cambios si es necesario
    const [perfil, setPerfil] = useState({...dueño, pass:'***'}); // hook de estado de las variables del perfil. Este es el estado en directo con los cambios aplicados en front-end, que se utiliza para mantener los cambios hasta que sean guardados en la base de datos
    const [guardable, setGuardable]= useState(true); // hook booleano que determina si las variables del perfil son optimas para que este pueda ser guardado en base de datos
    const emailRegex = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'; // regex del campo email
    let now = dayjs(); // fecha con valor de en este momento

    useEffect(()=>{ // si guardarPerfil se pone en cualquier momento a 'true' esta funcion hace de trigger y permite guardar o descartar los datos
        if(props.savePerfilProps.guardarPerfil){
            if(guardable)save();
            else {
                props.messageProps.setErrMessage('Alguno de los datos no era valido y finalmente se ha descartado');
                cancel();
            }
        }
    },[props.savePerfilProps.guardarPerfil])
    
    const _setPerfil = (nombre:string,elem:string) => { // funcion para pasarla a los editableInput para que seteen la variable perfil correspondiente
        setPerfil({...perfil, [nombre]:elem});
    }
    const edit =() => { // funcion que se ejecuta cuando el perfil esta en modo edicion
        _setPerfil('pass','');
        setGrupoClass('grupo-edit');
        passInput.current.placeholder='mantener contraseña';
        setEditPerfil(true);
        props.savePerfilProps.setEditarPerfil(true);
    }
    const cancel =() => { // funcion que se ejecuta para cancelar los cambios temporales hechos en perfil
        setGrupoClass('grupo');
        setPerfil({...perfilInicial});
        passInput.current.placeholder='';
        passInput.current.type='password';
        setEditPerfil(false);
        props.savePerfilProps.setEditarPerfil(false);
    }
    const save = () => { // funcion que se ejecuta para guardar los cambios temporales hechos en perfil
        setMe(perfil).
        then((res:any)=>{
            if (res.status === 200) {
                props.messageProps.setSuccessMessage('Usuario actualizado correctamente');
                dispatch(setDueño(perfil));
            }
            else console.log(res) // falta tratarlo
        });
        _setPerfil('passss','***');
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
        }, 1000);
    }
    useEffect(()=>{ // funcion que comprueba a cada cambio del perfil si este pasa las necesidades técnicas para cada campo
        if(
            perfil.nombre!=='' &&
            perfil.apellido!=='' &&
            perfil.telefono!=='' &&
            perfil.email.match(emailRegex)
        ) setGuardable(true);
        else setGuardable(false);
    },[perfil])
    return (
        <>
            <div>
                <h2>Perfil</h2>
                {dueño.token !== '' && (
                    <div className='espaciado'>
                        {!editPerfil?(
                            <div>
                                <Button className='espaciado' variant='primary' onClick={()=>{edit();}}>Editar</Button>
                            </div>
                        ):(
                            <div>
                                <Button className='espaciado' variant='success' disabled={!guardable} onClick={()=>{save();}}>Guardar</Button>
                                <Button className='espaciado' variant='danger' onClick={()=>{cancel();}}>Cancelar</Button>
                            </div>
                        )}
                        <div className={'grupo-perfil '+grupoClass}>
                            <EditableInput label='Nombre' nombre='nombre' editFlag={editPerfil} value={perfil.nombre} set={_setPerfil} ref={nombreInput} required/>
                            <EditableInput label='Apellido' nombre='apellido' editFlag={editPerfil} value={perfil.apellido} set={_setPerfil} ref={apellidoInput} required/>
                            <EditableInput label='Teléfono' nombre='telefono' editFlag={editPerfil} value={perfil.telefono} set={_setPerfil} ref={telefonoInput} required/>
                            <EditableInput label='Email' nombre='email' type='email' editFlag={editPerfil} value={perfil.email} ref={emailInput} set={_setPerfil} pattern={emailRegex} required/>
                            <EditableInput visibleFlag type='password' label='Pass' nombre='pass' editFlag={editPerfil} value={perfil.pass} set={_setPerfil} ref={passInput}/>
                        </div>
                        <div>
                            <Button className='espaciado' variant='danger' onClick={()=>logout('correcto')}>Logout</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}