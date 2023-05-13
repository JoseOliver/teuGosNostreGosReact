import { Component, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice'
import { Button, Nav, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import * as dayjs from 'dayjs'
import { login } from '../services/apiCalls';
import { useNavigate } from 'react-router-dom';

type Auth ={
    page:string
}

const Auth = (auth:Auth) => {
    const navigate = useNavigate();
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    //login or registro
    const [visibleDiv, setVisibleDiv] = useState();
    //login values
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    //success
    const [visibleSuccess, setVisibleSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    //error button
    const [errBtnSpinner, setErrBtnSpinner] = useState(false);
    //error
    const [visibleErr, setVisibleErr] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const select = (me:any) => {
        setVisibleDiv(me);
        if(me === '1')
        navigate('/auth/login');
        else 
        navigate('/auth/registro');
    }
    useEffect(()=>{select(auth.page)},[auth]);
    useEffect(()=>{
        if( errMessage !== '')setVisibleErr(true);
    },[errMessage]);
    var now = dayjs();
    return (
        <div>
            <h3>Autenticación</h3>
            <Nav variant="tabs" activeKey={visibleDiv} onSelect={(me) => select(me)}>
                <Nav.Item>
                    <Nav.Link eventKey="1">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="2">Registro</Nav.Link>
                </Nav.Item>
            </Nav>
            <h4>Login</h4>
            { visibleDiv === '1' && dueño.dueño.token === '' && (
                <div className="login espaciado">
                    <label htmlFor="">Email</label>
                    <div>
                        <input value={email} onChange={(event:any)=>setEmail(event.target.value)}/>
                        <span className='error'></span>
                    </div>
                    <label htmlFor="">Contraseña</label>
                    <div>
                        <input type='password' value={pass} onChange={(event:any)=>setPass(event.target.value)}/>
                        <span className='error'></span>
                    </div>
                    <Button className='espaciado' variant='primary' onClick={()=>
                        {
                            setErrBtnSpinner(true);
                            login(email,pass)
                            .then((res)=>{
                                if (res.code === 'ERR_NETWORK')setErrMessage(res.message);
                                if (res.code === 'ERR_BAD_REQUEST')setErrMessage('Permiso denegado, comprueba los datos introducidos');
                                if (res.status === 200){
                                    setSuccessMessage('Login realizado correctamente');
                                    dispatch(setDueño({
                                        token: res.data
                                    }))
                                }
                                setErrBtnSpinner(false)
                            });
                        }
                    }>
                        {errBtnSpinner? (
                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                            ):(<span>Login</span>)
                        }
                    </Button>
                </div>
            )}
            { visibleDiv === '1' && dueño.dueño.token !=='' && (
                <div>Bienvenido de nuevo {dueño.dueño.nombre}</div>
            )}
            { visibleDiv === '2' && (
                <div className='register espaciado'>
                    <h4>Registro</h4>
                </div>
            )}
        <ToastContainer position='bottom-center'>
        <Toast onClose={() => {
            setVisibleErr(false);
            setErrMessage('');
            }} show={visibleErr} delay={3000} autohide>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">El teu Gos, el Nostre Gos</strong>
                <small>{now.format('hh:mm a')}</small>
            </Toast.Header>
            <Toast.Body>Error: {errMessage}</Toast.Body>
        </Toast>
        <Toast onClose={() => {
            setVisibleSuccess(false);
            setSuccessMessage('');
            }} show={visibleSuccess} delay={3000} autohide>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">El teu Gos, el Nostre Gos</strong>
                <small>{now.format('hh:mm a')}</small>
            </Toast.Header>
            <Toast.Body>Exito: {successMessage}</Toast.Body>
        </Toast>
        </ToastContainer>
        </div>
    )
}

export default Auth