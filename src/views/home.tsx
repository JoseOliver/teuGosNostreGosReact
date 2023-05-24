import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { selectMe, resetDueño } from "../app/dueñoSlice";
import { selectMyPerros, selectSelectedPerro, setPerros } from "../app/perroSlice"
import { Button } from "react-bootstrap";

export const Home = () => {
    const dueño = useSelector(selectMe);
    const perros = useSelector(selectMyPerros);
    const selectedperro = useSelector(selectSelectedPerro);
    const dispatch = useDispatch();
    let usuario = {nombre:'Juan'};
    // useEffect(()=>{
    //     console.log(dueño);
    // },[dueño]);
    return (
        <>
            <Button onClick={()=>{console.log(dueño)}}>mostrar Dueño</Button>
            <Button onClick={()=>{console.log(perros)}}>mostrar Perros</Button>
            <Button onClick={()=>{console.log(perros.perros[selectedperro -1])}}>mostrar Perro</Button>
            <Button onClick={()=>{dispatch(setPerros({perros:[{nombre:'perro1'}]}))}}>set Perros</Button>
            <Button onClick={()=>{dispatch(setPerros({selected:1}))}}>set Perro</Button>
        </>
    )
}