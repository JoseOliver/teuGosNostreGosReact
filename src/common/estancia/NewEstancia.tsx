import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPerros } from '../../app/perroSlice';
import { resetDueño, selectMe } from '../../app/dueñoSlice';
import EditableInput from '../editableInput/EditableInput';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createEstancia, getCuidadores, getMe } from '../../services/apiCalls';
import './Estancia.css';

const NewEstancia = (props:any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dueño= useSelector(selectMe);
    const perros= useSelector(selectMyPerros);
    const [cuidadores, setCuidadores]= useState([{
        id:'-1'
    }]);
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
        getCuidadores(dueño.token)
        .then((res:any) => {
            setCuidadores(res.data.data);
        })
        .catch((error:any) => {
            props.messageProps.setErrMessage(error.message);
        });
        if(perros.selected) _setEstancia('numPerro',perros.perros[perros.selected -1].num);
    },[])
    useEffect(()=>{
        if(
            perfilEstancia.numPerro === '' ||
            perfilEstancia.inicio === '' ||
            perfilEstancia.fin === '' ||
            perfilEstancia.cuidadorId === ''
        ) setGuardable(false);
        else setGuardable(true);
        // console.log(perfilEstancia)
    },[perfilEstancia]);

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
    const save = () => {
        // todo
        let body = {
            "props":{
                "perro_id":perfilEstancia.numPerro,
                "cuidador_id":perfilEstancia.cuidadorId,
                "inicio":perfilEstancia.inicio,
                "fin":perfilEstancia.fin
            }
        };
        createEstancia(body,dueño.token)
        .then((res)=>{
            if(res.status === 200) props.messageProps.setSuccessMessage('Estancia correctamente creada');
            else props.messageProps.setErrMessage(res.message);
        });
    }
    return (
        <div className='espaciado'>
            <Button variant='primary' className='espaciado' onClick={()=>{
                navigate(-1);
                props.messageProps.setErrMessage('Edicion cancelada. No se ha realizado ninguna gestión');
                }}>Atras</Button>
            <div className='espaciado column'>
                <div className='columna'>
                    <div className='columna espaciado-lateral'>
                        <label className='label espaciado tabulado' htmlFor="perro">Perro: </label>
                        <select className='redondeado' name="perro" id="perro" defaultValue={
                            perros.perros[perros.selected -1] ? 
                            (
                                perros.perros[perros.selected -1].nombre
                            ):(
                                -1
                            ) 
                        } onChange={(elem:any)=>{
                            let perroSeleccionado:string = elem.target.value;
                            if(perroSeleccionado=== '-1')
                                _setEstancia('numPerro','');
                            else for (let perro of perros.perros){
                                if (perro.nombre.match(perroSeleccionado)) _setEstancia('numPerro',perro.num);
                            }
                        }}>
                            <option value='-1'>Elige...</option>
                            {perros.perros.map((perro:any)=>{ return(
                                <option key={perro.num} value={perro.nombre}>{perro.nombre}</option>
                                )})}
                        </select>
                    </div>
                    <div className='columna espaciado-lateral'>
                        <label className='label espaciado tabulado' htmlFor="cuidador">Cuidador: </label>
                        <select className='redondeado' name="cuidador" id="cuidador" defaultValue='-1' onChange={(elem:any)=>{
                            let cuidadorSeleccionado:string = elem.target.value;
                            if(cuidadorSeleccionado === '-1')
                                _setEstancia('cuidadorId','');
                            else for (let cuidador of cuidadores){
                                if (cuidador.id.toString().match(cuidadorSeleccionado)) _setEstancia('cuidadorId',cuidador.id);
                            }
                        }}>
                            <option value='-1'>Elige...</option>
                            {cuidadores.map((cuidador:any)=>{ return(
                                <option key={cuidador.id} value={cuidador.id}>{cuidador.nombre} {cuidador.apellido}</option>
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