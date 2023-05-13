import { useEffect, useRef, useState } from 'react'
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
    //login or registro selector '1' or '2'
    const [visibleDiv, setVisibleDiv] = useState();
    //login values
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const emailInput:any = useRef();
    const passInput:any = useRef();
    //submit switch
    const [canSubmit, setCanSubmit] = useState(false);
    //success
    const [visibleSuccess, setVisibleSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    //error button
    const [errBtnSpinner, setErrBtnSpinner] = useState(false);
    //error
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [visibleErr, setVisibleErr] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    //regex
    const emailRegex = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$";
    //dayjs
    let now = dayjs();
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
    const handleFocus =(me:any)=>{
        switch(me.target.name){
            case 'email':
                setEmailError('');
                break;
            case 'pass':
                setPassError('');
                break;
        }
    }
    const handleBlur =()=>{
            if(email!=='' && !emailInput.current.validity.valid)setEmailError('Debes introducir un email correcto');
            else setEmailError('');
            if(pass==='')setPassError('El password no puede estar vacio');
            else setPassError('');
            if(emailInput.current.validity.valid && passInput.current.validity.valid)setCanSubmit(false);
            else setCanSubmit(true);   
        
    }
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
            { visibleDiv === '1' && dueño.dueño.token === '' && (
                <div className="login espaciado">
                    <h4>Login</h4>
                    <label htmlFor="">Email</label>
                    <div>
                        <input name='email' onFocus={handleFocus} onBlur={handleBlur} ref={emailInput} required pattern={emailRegex} value={email} onChange={(event:any)=>setEmail(event.target.value)}/>
                        <span className='error'>{emailError}</span>
                    </div>
                    <label htmlFor="">Contraseña</label>
                    <div>
                        <input name='pass' onFocus={handleFocus} onBlur={handleBlur} ref={passInput} required type='password' value={pass} onChange={(event:any)=>setPass(event.target.value)}/>
                        <span className='error'>{passError}</span>
                    </div>
                    <Button type='submit' disabled={canSubmit} className='espaciado' variant='primary' onClick={()=>
                        {
                            setErrBtnSpinner(true);
                            login(email,pass)
                            .then((res)=>{
                                if (res.code === 'ERR_NETWORK')setErrMessage('Fallo de conexión al servidor');
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
            <Toast.Body className='error'>Error: {errMessage}</Toast.Body>
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