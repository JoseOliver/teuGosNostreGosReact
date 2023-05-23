import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { selectMe, resetDueño } from "../app/dueñoSlice";
import { Button } from "react-bootstrap";

export const Home = () => {
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    let usuario = {nombre:'Juan'};
    // useEffect(()=>{
    //     console.log(dueño);
    // },[dueño]);
    return (
        <>
            <Button onClick={()=>{console.log(dueño)}}>mostrar Dueño</Button>
        </>
    )
}