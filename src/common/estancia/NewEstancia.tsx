import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPerros } from '../../app/perroSlice';
import { selectMe } from '../../app/dueñoSlice';
import EditableInput from '../editableInput/EditableInput';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NewEstancia = (props:any) => {
    const navigate = useNavigate();
    const me= useSelector(selectMe);
    const perros= useSelector(selectMyPerros);
    const inicioInput:any = useRef();
    const finInput:any = useRef();
    const [perfilEstancia, setPerfilEstancia] = useState({
        numPerro:'',
        inicio:'',
        fin:'',
        cuidadorId:''
    });
    const [guardable, setGuardable] = useState(false);
    const _setEstancia = (nombre:string, value:string) => {
        setPerfilEstancia({...perfilEstancia, [nombre]:value});
    };
    useEffect(()=>{
        if(
            perfilEstancia.numPerro === '' || perfilEstancia.numPerro == '-1' ||
            perfilEstancia.inicio === '' ||
            perfilEstancia.fin === '' ||
            perfilEstancia.cuidadorId === ''
        ) setGuardable(false);
        else setGuardable(true);
    },[perfilEstancia]);

    const save = () => {
        // todo
    }
    return (
        <div className='espaciado'>
            <Button variant='primary' className='espaciado' onClick={()=>{
                navigate(-1);
                props.messageProps.setErrMessage('Edicion cancelada. No se ha realizado ninguna gestión');
                }}>Atras</Button>
            <div className='espaciado column'>
                <div className='columna'>
                    <div className='flex espaciado edit-input'>
                        <label className='label espaciado tabulado' htmlFor="perro">Perro: </label>
                        <select className='redondeado' name="perro" id="perro" defaultValue={
                            perros.perros[perros.selected -1] ? 
                            (
                                perros.perros[perros.selected -1].num
                            ):(
                                -1
                            ) 
                        } onChange={(elem:any)=>{
                            let perroSeleccionado:string = elem.target.value;
                            for (let perro of perros.perros){
                                if (perro.nombre.match(perroSeleccionado)) _setEstancia('numPerro',perro.num);
                            }
                        }}>
                            <option value='-1'>Elige...</option>
                            {perros.perros.map((perro:any)=>{ return(
                                <option key={perro.num} value={perro.num}>{perro.nombre}</option>
                                )})}
                        </select>
                    </div>
                    <EditableInput set={_setEstancia} label='Fecha inicio: ' nombre='inicio' value={perfilEstancia.inicio} ref={inicioInput} editFlag={true} type='datetime-local'></EditableInput>
                    <EditableInput set={_setEstancia} nombre='fin' label='Fecha fin: ' value={perfilEstancia.fin} ref={finInput} editFlag={true} type='datetime-local'></EditableInput>
                </div>
            </div>
            <Button className='espaciado' variant='success' disabled={!guardable} onClick={()=>save()}>Guardar</Button>
        </div>
    )
}

export default NewEstancia