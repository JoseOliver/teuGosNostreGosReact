import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import EditableInput from '../editableInput/EditableInput'
import { selectMyPerros, setPerros } from '../../app/perroSlice'
import { setMyPerro } from '../../services/apiCalls'
import { selectMe } from '../../app/dueñoSlice'

const Perro = (props:any) => {
  const dueño= useSelector(selectMe);
  const perros= useSelector(selectMyPerros);
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const [editFlag, setEditFlag] = useState(false);
  const numInput:any=useRef();
  const nombreInput:any=useRef();
  const nacimientoInput:any=useRef();
  const anotacionesInput:any=useRef();
  const [perfilPerro, setPerfilPerro] = useState(perros.perros[perros.selected -1]);
  const [perfilPerroInicial, setPerfilPerroInicial] = useState(perros.perros[perros.selected -1]);
  const [guardable, setGuardable] = useState(true);
  useEffect(()=>{
    if(
        perfilPerro.nombre!=='' &&
        perfilPerro.fecha_nacimiento!==''
    ) setGuardable(true);
    else setGuardable(false);
},[perfilPerro])

  const _setPerfilPerro = (nombre:string,elem:string) => {
    setPerfilPerro({...perfilPerro, [nombre]:elem});
  }
  const edit = () => {
    setEditFlag(true);
    props.savePerroProps.setEditarPerro(true);
  };
  const save = () => {
    setMyPerro(dueño.token,perfilPerro.num, {
      nombre: perfilPerro.nombre,
      fecha_nacimiento:perfilPerro.fecha_nacimiento,
      anotaciones:perfilPerro.anotaciones
    })
    .then((res:any)=>{
      if (res.status === 200) {
        props.messageProps.setSuccessMessage('Perro actualizado correctamente');
        let _perros= [...perros.perros];
        _perros[(perfilPerro.num -1)]=perfilPerro;
        dispatch(setPerros({perros:_perros}));
    }
    else console.log(res) // falta tratarlo
    });
    setEditFlag(false);
    props.savePerroProps.setGuardarPerro(false);
    props.savePerroProps.setEditarPerro(false);
  };
  const cancel = () => {
    props.savePerroProps.setEditarPerro(false);
    setPerfilPerro({...perfilPerroInicial})
    setEditFlag(false);
  };

  useEffect(()=>{
    if(props.savePerroProps.guardarPerro){
      if(guardable) save();
      else {
        props.messageProps.setErrMessage('Alguno de los datos no era valido y finalmente se ha descartado');
        cancel();
      }
    }
},[props.savePerroProps.guardarPerro])

  return (
    <div className='espaciado'>
      <Button variant='primary' className='espaciado' onClick={()=>navigate('/perfil/dueño')}>Atras</Button>
      { !editFlag? (
        <>
          <Button variant='primary' className='espaciado' onClick={()=>{edit()}}>Editar</Button>
        </>
      ):(
        <>
        <Button variant='success' className='espaciado' disabled={!guardable} onClick={()=>{save()}}>Guardar</Button>
        <Button variant='danger' className='espaciado' onClick={()=>{cancel()}}>Cancelar</Button>
        </>
      )}
      <h3>Hoja de {perros.perros[perros.selected -1].nombre}</h3>
      { !editFlag? (
        <>
          <div className='espaciado'>
            <label htmlFor="num" className='label tabulado'>Número: </label>
            <span>{perros.perros[perros.selected -1].num}</span>
            <br />
            <label htmlFor="nombre" className='label tabulado'>Nombre: </label>
            <span>{perros.perros[perros.selected -1].nombre}</span>
            <br />
            <label htmlFor="nacimiento" className='label tabulado'>Nacimiento: </label>
            <span>{perros.perros[perros.selected -1].fecha_nacimiento}</span>
            <br />
            <label htmlFor="nombre" className='label tabulado'>Anotaciones: </label>
            <span>{perros.perros[perros.selected -1].anotaciones}</span>
          </div>
          <Button variant='primary' className='espaciado'>Ver sus Estancias</Button>
        </>
):(
  <>
    <div className='espaciado'>
      <EditableInput required set={_setPerfilPerro} nombre='num' ref={numInput} editFlag={false} label='Número: ' value={perfilPerro.num}></EditableInput>
      <EditableInput required set={_setPerfilPerro} nombre='nombre' ref={nombreInput} editFlag={editFlag} label='Nombre: ' value={perfilPerro.nombre}></EditableInput>
      <EditableInput type='date' required set={_setPerfilPerro} nombre='fecha_nacimiento' ref={nacimientoInput} editFlag={editFlag} label='Nacimiento: ' value={perfilPerro.fecha_nacimiento}></EditableInput>
      <EditableInput set={_setPerfilPerro} nombre='anotaciones' ref={anotacionesInput} editFlag={editFlag} label='Anotaciones: ' value={perfilPerro.anotaciones}></EditableInput>
    </div>
  </>
) }
    </div>
  )
}

export default Perro