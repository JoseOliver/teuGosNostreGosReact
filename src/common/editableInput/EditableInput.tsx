import { useState, forwardRef, ForwardedRef, useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Icon from '@mdi/react';
import { mdiEyeCircleOutline } from '@mdi/js';

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

    const setVisible = () => {
        console.log()
        switch(ref.current.type){
            case 'password':
                ref.current.type='text';
                break;
            case 'text':
                ref.current.type='password';
                break;

        }
    }
    return (
        <div className='flex espaciado'>
            <label className='espaciado tabulado' htmlFor="input">{props.label}</label>
            <input ref={ref} type={props.type} placeholder={props.placeholder} required={props.required} maxLength={20} readOnly={!props.editFlag} value={props.value} onChange={(elem)=>{
                props.set(props.nombre,elem.target.value);
                }} pattern={props.pattern}/>
            {props.visibleFlag && props.visibleFlag === true && props.editFlag && <Button variant='light' onClick={setVisible}><Icon path={mdiEyeCircleOutline} size={1} /></Button>}
            {props.editFlag && !ref.current.validity.valid && props.nombre!=='pass' && props.value==='' && <span className='error'>El {props.nombre} no puede ser vacio</span>}
        </div>
    )});


export default EditableInput