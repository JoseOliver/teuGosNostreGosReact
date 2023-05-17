import { useState, forwardRef, ForwardedRef } from 'react'

type EditableInput ={
    editFlag:boolean,
    _value:any,
    ref:Function
}
const EditableInput = forwardRef((props:EditableInput, ref:any) => (
        <input ref={ref} contentEditable={props.editFlag} value={props._value}/>
    ));
    

export default EditableInput