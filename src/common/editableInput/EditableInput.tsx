import { useState, forwardRef, ForwardedRef, useRef, useEffect } from 'react'

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
}
const EditableInput = forwardRef((props:EditableInput, ref:any) => {

    return (
        <div>
            <label className='espaciado tabulado' htmlFor="input">{props.label}</label>
            <input ref={ref} placeholder={props.placeholder} required={props.required} maxLength={20} readOnly={!props.editFlag} value={props.value} onChange={(elem)=>{
                props.set(props.nombre,elem.target.value);
                }} pattern={props.pattern}/>
            {props.editFlag && !ref.current.validity.valid && props.nombre!=='pass' && props.value==='' && <span className='error'>El {props.nombre} no puede ser vacio</span>}
        </div>
    )});


export default EditableInput