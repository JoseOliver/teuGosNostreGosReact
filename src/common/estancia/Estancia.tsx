import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../../app/dueñoSlice';
import { selectMyPerros } from '../../app/perroSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Estancia = () => {
  const dueño= useSelector(selectMe);
  const perros= useSelector(selectMyPerros);
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const [editFlag, setEditFlag] = useState(false);
  const numInput:any=useRef();
  const nombreInput:any=useRef();
  const nacimientoInput:any=useRef();
  const anotacionesInput:any=useRef();
  const [perfilEstancia, setPerfilEstancia] = useState({
    ...perros.perros[perros.selected].estancias[perros.selectedEstancia]
  });
  const [perfilPerroInicial, setPerfilPerroInicial] = useState({
    ...perros.perros[perros.selected].estancias[perros.selectedEstancia]
  });
  const [guardable, setGuardable] = useState(true);

  useEffect(()=>{
    console.log(perros.perros[perros.selected].estancias[perros.selectedEstancia])
  },[]);

  const edit = () => {};
  const save = () => {};
  const cancel = () => {};

  return (
    <div>
      <Button variant='primary' className='espaciado' onClick={()=>{
        // if(props.savePerroProps.editarPerro){
        //   props.savePerroProps.setEditarPerro(false);
        //   props.messageProps.setErrMessage('Edicion cancelada. No se ha realizado ninguna gestión');
        // }
        navigate(-1);
        }}>Atras
      </Button>
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
      <h3>Estancia ID: {perfilEstancia.id}</h3>
    </div>
  )
}

export default Estancia