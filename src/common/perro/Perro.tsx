import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import EditableInput from '../editableInput/EditableInput'
import { selectMyPerros, setPerros } from '../../app/perroSlice'
import { getMe, setMyPerro } from '../../services/apiCalls'
import { resetDueño, selectMe } from '../../app/dueñoSlice'
import './Perro.css'

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
  useEffect(()=>{
    getMe(dueño.token)
    .then((res:any)=>{
        if(!(res.status === 200)) logout('expirado');
    });
  },[]);
  const logout = (status:string) => {
    dispatch(resetDueño());
    if(status === 'expirado') props.messageProps.setErrMessage('Sesión expirada, debe hacer login de nuevo');
    if(status === 'correcto') props.messageProps.setSuccessMessage('Sesión cerrada correctamente');
    setTimeout(() => {
        navigate('/');
    }, 1000);
}
  return (
    <div className='espaciado'>
      <Button variant='primary' className='espaciado' onClick={()=>{
        navigate('/perfil/dueño');
        if(props.savePerroProps.editarPerro){
          props.savePerroProps.setEditarPerro(false);
          props.messageProps.setErrMessage('Edicion cancelada. No se ha realizado ninguna gestión');
        }
        }}>Atras</Button>
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
          <h3>Estancias</h3>
          <Button variant='primary' className='espaciado' onClick={()=>{
            navigate('/perfil/dueño/nueva-estancia');
          }}>Nueva estancia</Button>
          <div className='espaciado grupo repartido'>
          { perros.perros[perros.selected -1].estancias !== undefined ? (
              perros.perros[perros.selected -1].estancias.map((elem:any) =>{
                return (
                  <div key={'estancia'+ elem.id} className='estancia espaciado'>
                    <label htmlFor="id" className='label tabulado'>Id estancia: </label><span id='id'>{elem.id}</span><br />
                    <label htmlFor="inicio" className='label tabulado'>Fecha inicio: </label><span id='inicio'>{elem.inicio}</span><br />
                    <label htmlFor="fin" className='label tabulado'>Fecha fin: </label><span id='fin'>{elem.fin}</span><br />
                    <div className='centrado'>
                      <Button variant='primary' className='espaciado' onClick={()=>{}}>Ver</Button>
                      <Button variant='danger' className='espaciado' onClick={()=>props.messageProps.setErrMessage('Para eliminar debes hablar con tu cuidador antes')}>Quitar</Button>
                    </div>
                  </div>
                )
              })
            ):(
              <span key='sin-estancias'>Sin estancias</span>
            )
          }
          </div>
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