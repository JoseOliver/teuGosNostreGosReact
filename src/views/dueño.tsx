import React, {useState, useEffect} from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../app/dueñoSlice';
import { getMyPerros } from '../services/apiCalls';
import { selectMyPerros, setPerros } from '../app/perroSlice';
import { useNavigate } from 'react-router-dom';

const Dueño = () => {
  const [perrosClass, setPerrosClass]= useState('grupo');
  const [estanciasClass, setEstanciasClass]= useState('grupo');
  const dueño= useSelector(selectMe);
  const perros= useSelector(selectMyPerros);
  const dispatch= useDispatch();
  const navigate= useNavigate();

  useEffect(()=>{
    getMyPerros(dueño.token)
    .then((res)=>{
      if(res.status===200){
        dispatch(setPerros({perros:res.data.data}));
      }
    })
    .catch((err)=>{console.log(err)});
  },[]);

  const verPerroDetalle =(perro:any) =>{
    dispatch(setPerros({selected:perro.num}));
    navigate('perro');
  }
  return (
    <>
      <div className='espaciado'>
        <h2>Panel de dueño</h2>
        <div className='espaciado'>
          <h3>Mis Perros</h3>
          <Button className='espaciado' onClick={()=>navigate('/perfil/dueño/nuevo-perro')}>Nuevo Perro</Button>
          {perros.perros.length===1 && perros.perros[0].num===-1?(
            <>
              <div id='perros' className={perrosClass}>Perros...
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            </>
          ):(
            <>
            <div className='grupo repartido'>
              {perros.perros.map((perro:any)=>{
                return(
                  <div className='perro-preview espaciado' onClick={()=>verPerroDetalle(perro)} key={perro.num}>
                    <label className='label' htmlFor="num">Número: </label>
                    <span> {perro.num}</span>
                    <br />
                    <label className='label' htmlFor="nombre">Nombre: </label>
                    <span> {perro.nombre}</span>
                    <br />
                    <div className='centrado'>
                      <Button variant='primary' className='espaciado' onClick={()=>verPerroDetalle(perro)}>Ver</Button>
                      <Button variant='danger' className='espaciado'>Quitar</Button>
                    </div>
                  </div>
                )
              })}
            </div>
            </>
          )}
        </div>
        <div className='espaciado'>
          <h3>Sus estancias activas</h3>
          <Button className='espaciado'>Nueva estancia</Button>
          <div id='estancias' className={estanciasClass}>Estancias...
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default Dueño