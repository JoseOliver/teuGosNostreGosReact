import { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice';

export const Perfil = () => {
    const navigate = useNavigate();
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    return (
        <div>
            <h2>Perfil</h2>
            {dueño.dueño.token !== '' && (
                <Button variant='danger' onClick={()=>dispatch(resetDueño())}>Logout</Button>
            )}
        </div>
    )
}