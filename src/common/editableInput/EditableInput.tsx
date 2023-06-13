import { useState, forwardRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Icon from '@mdi/react';
import { mdiEyeCircleOutline } from '@mdi/js';
import './EditableInput.css';

type EditableInput ={
    nombre:string,  // variable que determina que campo se debe setear en la funcion 'set'
    editFlag:boolean,  // booleano que determina si el valor de ese campo esta siendo editado
    value:any,  // variable que trae el valor enlazado al input desde el padre
    ref:Function  // variable que trae la referencia enlazada al input desde el padre 
    pattern?:string, // variable que trae oppcionalmente el patron a seguir en el input
    placeholder?:string, // variable opcional que setea el placeholder del input
    set:Function,  // funcion que permite setear el valor en el onchange para que se pueda enlazar el hook del padre con el input
    required?:boolean, // setea el estado del requerido para poder editar el input
    label?:string  // valor del label que acompaña al input
    visibleFlag?:boolean,  // booleano que determina la visibilidad del texto del input, utilizado para contraseñas
    type?:string // variable que define el tipo del texto que contendrá el input, utilizado para email y contraseña
}
const EditableInput = forwardRef((props:EditableInput, ref:any) => { // objeto EditableInput creado con fordwardRef para pasar las referencias del padre
    const [error,setError] = useState(''); // valor del error mostrado
    const [firstEdit, setFirstEdit] = useState(true); // booleano que permite obviar visualmente los errores antes de realizar el primer change del input
    useEffect(()=>{ // funcion trigger que, según el valor de editFlag, setea la clase para mostrar los estilos segun sera un valor valido o invalido
        if(!props.editFlag){
            ref.current.classList.remove("invalid");
            setError('');
        }
        else checkValidity();
    },[props.editFlag])
    const setVisible = () => { // funcion que permite visualizar la contraseña según se esta editando. solo switchea el type del input a 'text' o a 'password'
        switch(ref.current.type){
            case 'password':
                ref.current.type='text';
                break;
            case 'text':
                ref.current.type='password';
                break;
        }
    }
    const checkValidity = () => {  // funcion que valora la validez del valor del input cada vez que este cambia, seteando asi todo lo necesario para mostrar el error y prohibir el guardado de datos
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
            <label className='label espaciado tabulado' htmlFor={props.nombre}>{props.label}</label>
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