import React, { useEffect, useRef, useState } from 'react'
import EditableInput from '../editableInput/EditableInput'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { newPerro } from '../../services/apiCalls';
import { selectMe } from '../../app/dueñoSlice';
import { useSelector } from 'react-redux';
import { selectMyPerros } from '../../app/perroSlice';

const NewPerro = (props:any) => {
    const [perfilPerro, setPerfilPerro]= useState({
        nombre:'',
        fecha_nacimiento:'',
        anotaciones:''
    });
    const dueño = useSelector(selectMe);
    const perros = useSelector(selectMyPerros);
    const navigate= useNavigate();
    const nombreInput:any=useRef();
    const nacimientoInput:any=useRef();
    const anotacionesInput:any=useRef();
    const [guardable, setGuardable] = useState(false);
    const _setPerfilPerro = (nombre:string,elem:string) => {
        setPerfilPerro({...perfilPerro, [nombre]:elem});
    }
    const save = () => {
        newPerro(dueño.token, perfilPerro)
        .then((res:any)=>{
            if(res.status===200)props.messageProps.setSuccessMessage('Nuevo perro: '+ res.data.data.nombre +' añadido correctamente');
        });
        navigate('/perfil/dueño/');
    }
    useEffect(()=>{
        if(
            perfilPerro.nombre!=='' &&
            perfilPerro.fecha_nacimiento!==''
        ) setGuardable(true);
        else setGuardable(false);
    },[perfilPerro])
    return (
        <>
            <div className='espaciado'>
            <Button onClick={()=>{
                navigate('/perfil/dueño');
                props.messageProps.setErrMessage('No se ha realizado ninguna gestión');
                }}>Atras</Button>
            <EditableInput required set={_setPerfilPerro} nombre='nombre' ref={nombreInput} editFlag={true} label='Nombre: ' value={perfilPerro.nombre}></EditableInput>
            <EditableInput type='date' required set={_setPerfilPerro} nombre='fecha_nacimiento' ref={nacimientoInput} editFlag={true} label='Nacimiento: ' value={perfilPerro.fecha_nacimiento}></EditableInput>
            <EditableInput set={_setPerfilPerro} nombre='anotaciones' ref={anotacionesInput} editFlag={true} label='Anotaciones: ' value={perfilPerro.anotaciones}></EditableInput>
            <Button variant='success' disabled={!guardable} onClick={()=>save()}>Guardar</Button>
            </div>
        </>
    )
}

export default NewPerro