import React, {useState} from 'react';
import { Button, Spinner } from 'react-bootstrap';

const Dueño = () => {
  const [perrosClass, setPerrosClass]= useState('grupo');
  const [estanciasClass, setEstanciasClass]= useState('grupo');
  
  return (
    <>
      <div className='espaciado'>
        <h2>Panel de dueño</h2>
        <div className='espaciado'>
          <h3>Mis Perros</h3>
          <Button className='espaciado'>Nuevo Perro</Button>
          <div id='perros' className={perrosClass}>Perros...
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </div>
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