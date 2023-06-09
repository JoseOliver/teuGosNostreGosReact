import React, {useState, useEffect} from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../app/dueñoSlice';
import { getMyEstancias, getMyPerros } from '../services/apiCalls';
import { selectMyPerros, setPerros } from '../app/perroSlice';
import { useNavigate } from 'react-router-dom';

const Dueño = (props:any) => {
  const [perrosClass, setPerrosClass]= useState('grupo');
  const [estanciasClass, setEstanciasClass]= useState('grupo');
  const dueño= useSelector(selectMe);
  const perros= useSelector(selectMyPerros);
  const dispatch= useDispatch();
  const navigate= useNavigate();

  useEffect(()=>{
    let perrosTemp:any;
    getMyPerros(dueño.token)
    .then((res)=>{
      if(res.status===200){
        perrosTemp= res.data.data;
        dispatch(setPerros({perros:res.data.data, selected:0}));
      }
    })
    .catch((err)=>{console.log(err)});
    getMyEstancias(dueño.token)
    .then((res)=>{
      if(res.status===200){
        let _perros= [];
        for(let perroIndex in perrosTemp){
          let _perro= {...perrosTemp[parseInt(perroIndex)]};
          if(res.data.data[parseInt(perroIndex)]){
            _perro.estancias= res.data.data[perroIndex];
          }
          _perros.push(_perro);
        }
        dispatch(setPerros({perros:_perros}));
      }
    })
    .catch((error)=>{console.log(error)});
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
            <div className='espaciado grupo repartido'>
              {perros.perros.map((perro:any)=>{
                return(
                    <div className='perro-preview espaciado'  key={perro.num+'perro'}>
                      <div className='' onClick={()=>verPerroDetalle(perro)}>
                        <label className='label' htmlFor="num">Número: </label>
                        <span> {perro.num}</span>
                        <br />
                        <label className='label' htmlFor="nombre">Nombre: </label>
                        <span> {perro.nombre}</span>
                        <br />
                      </div>
                      <div className='centrado'>
                        <Button variant='primary' className='espaciado' onClick={()=>verPerroDetalle(perro)}>Ver</Button>
                        <Button variant='danger' className='espaciado' onClick={()=>props.messageProps.setErrMessage('Para eliminar debes hablar con tu cuidador antes')}>Quitar</Button>
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
          { perros.perros.length===1 && perros.perros[0].num===-1?
            (
              <div id='estancias' className={estanciasClass}>Estancias...
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
              </div>
            ):(
              perros.perros.map((perro:any)=>{ return(
                
                  <div className='espaciado' key={'perro'+perro.num}>
                    <h4>De <span>{perro.nombre}</span></h4>
                    {perro.estancias? 
                      (
                        <div className='grupo repartido espaciado'>
                          {perro.estancias.map((estancia:any)=>{
                            return(
                                <div key={'estancia'+estancia.id} className='estancia espaciado'>
                                  <div key={'estanciaBis'+estancia.id}>
                                    <label htmlFor="id" className='label tabulado'>Id estancia: </label><span>{estancia.id}</span><br />
                                    <label htmlFor="inicio" className='label tabulado'>Fecha inicio: </label><span>{estancia.inicio}</span><br />
                                    <label htmlFor="fin" className='label tabulado'>Fecha fin: </label><span>{estancia.fin}</span><br />
                                  </div>
                                  <div key={'botoneraEstancia'+estancia.id} className='centrado'>
                                    <Button variant='primary' className='espaciado' onClick={()=>{}}>Ver</Button>
                                    <Button variant='danger' className='espaciado' onClick={()=>{}}>Quitar</Button>
                                  </div>
                                </div>
                            )
                          })}
                        </div>
                      ):(
                        <div className='grupo espaciado' key='noEstancias'>
                          <span>Sin estancias</span>
                        </div>
                      )
                    }
                  </div>
                
              )})
            )
          }

        </div>
      </div>
    </>
  )
}

export default Dueño