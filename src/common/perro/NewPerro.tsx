import React, { useEffect, useRef, useState } from 'react'
import EditableInput from '../editableInput/EditableInput'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const NewPerro = () => {
    const [perfilPerro, setPerfilPerro]= useState({
        nombre:'',
        fecha_nacimiento:'',
        anotaciones:''
    });
    const navigate= useNavigate();
    const nombreInput:any=useRef();
    const nacimientoInput:any=useRef();
    const anotacionesInput:any=useRef();
    const [guardable, setGuardable] = useState(false);
    const _setPerfilPerro = (nombre:string,elem:string) => {
        setPerfilPerro({...perfilPerro, [nombre]:elem});
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
            <Button onClick={()=>navigate('/perfil/dueño')}>Atras</Button>
            <EditableInput required set={_setPerfilPerro} nombre='nombre' ref={nombreInput} editFlag={true} label='Nombre: ' value={perfilPerro.nombre}></EditableInput>
            <EditableInput type='date' required set={_setPerfilPerro} nombre='fecha_nacimiento' ref={nacimientoInput} editFlag={true} label='Nacimiento: ' value={perfilPerro.fecha_nacimiento}></EditableInput>
            <EditableInput set={_setPerfilPerro} nombre='anotaciones' ref={anotacionesInput} editFlag={true} label='Anotaciones: ' value={perfilPerro.anotaciones}></EditableInput>
            <Button variant='success' disabled={!guardable}>Guardar</Button>
            </div>
        </>
    )
}

export default NewPerro