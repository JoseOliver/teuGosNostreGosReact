import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { selectMe, setDueño, resetDueño } from "../app/dueñoSlice";
import { Button } from "react-bootstrap";

export const Home = () => {
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    let usuario = {nombre:'Juan'};
    useEffect(()=>{
        console.log(dueño);
    },[dueño]);
    return (
        <>
            <div>Home</div>
            <label>Nombre: </label>
            <input type="text" onChange={(event:any)=>{
                dispatch(setDueño({nombre:event.target.value}));
                // console.log(event);
            }} placeholder='Nombre' />
        </>

    )
}