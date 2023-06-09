import { useState, forwardRef, ForwardedRef, useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Icon from '@mdi/react';
import { mdiEyeCircleOutline } from '@mdi/js';
import './EditableInput.css';

type EditableInput ={
    nombre:string,
    editFlag:boolean,
    value:any,
    ref:Function
    pattern?:string,
    placeholder?:string,
    set:Function,
    required?:boolean,
    label?:string
    visibleFlag?:boolean,
    type?:string
}
const EditableInput = forwardRef((props:EditableInput, ref:any) => {
    const [error,setError] = useState('');
    const [firstEdit, setFirstEdit] = useState(true);
    useEffect(()=>{
        if(!props.editFlag){
            ref.current.classList.remove("invalid");
            setError('');
        }
        else checkValidity();
    },[props.editFlag])
    const setVisible = () => {
        switch(ref.current.type){
            case 'password':
                ref.current.type='text';
                break;
            case 'text':
                ref.current.type='password';
                break;
        }
    }
    const checkValidity = () => {
        switch(ref.current.value){
            case '':
                ref.current.classList.add("invalid");
                if(!firstEdit)setError('El campo ' + props.nombre + ' es invalido, debe introducir algún valor');
                setFirstEdit(false);
                break;
            default:
                if( props.nombre==='email' && !ref.current.value.match(props.pattern) ){//is invalid email
                    //yes
                    ref.current.classList.add("invalid");
                    setError('El campo email es invalido');
                }
                else {
                    //no
                    ref.current.classList.remove("invalid");
                    setError('');
                }
        }
    }
    return (
        <div className='flex espaciado edit-input'>
            <label className='espaciado tabulado' htmlFor={props.nombre}>{props.label}</label>
            <input className='redondeado' id={props.nombre} ref={ref} type={props.type} placeholder={props.placeholder} required={props.required} maxLength={20} readOnly={!props.editFlag} value={props.value} onChange={(elem)=>{
                props.set(props.nombre,elem.target.value);
                checkValidity();
                setFirstEdit(false);
                }}/>
            {props.visibleFlag && props.visibleFlag === true && props.editFlag && <Button variant='light' onClick={setVisible}><Icon path={mdiEyeCircleOutline} size={1} /></Button>}
            {error!=='' && props.nombre!=='pass' && <span className='error centrado'>{error}</span>}
        </div>
    )});

export default EditableInput