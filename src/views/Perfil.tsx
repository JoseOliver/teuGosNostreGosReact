import { Component, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice';
import EditableInput from '../common/editableInput/EditableInput';

export const Perfil = () => {
    const navigate = useNavigate();
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    const [editPerfil, setEditPerfil] = useState(false);
    const nombreInput:any=useRef();
    // useEffect(()=>{console.log(nombreInput)},[]);
    return (
        <div>
            <h2>Perfil</h2>
            {dueño.dueño.token !== '' && (
                <>
                    <EditableInput editFlag={editPerfil} _value={dueño.dueño.nombre} ref={nombreInput}/>
                    <Button variant='danger' onClick={()=>{
                        dispatch(resetDueño());
                        navigate('/');
                    }}>Logout</Button>
                </>
            )}
        </div>
    )
}