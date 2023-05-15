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
    //LOGIN
    //common hooks
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
    //success message
    const [visibleSuccess, setVisibleSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    //error button spinner
    const [Reg_errBtnSpinner, setReg_ErrBtnSpinner] = useState(false);
    //error
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    //error message
    const [visibleErr, setVisibleErr] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    //regex
    const emailRegex = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$";
    //dayjs
    let now = dayjs();

    //REGISTRO
    const [Reg_email, setReg_Email] = useState('');
    const [Reg_pass, setReg_Pass] = useState('');
    const Reg_emailInput:any = useRef();
    const Reg_passInput:any = useRef();
    const [Reg_emailError, setReg_EmailError] = useState('');
    const [Reg_passError, setReg_PassError] = useState('');
    const [Reg_canSubmit, setReg_CanSubmit] = useState(false);
    const [errBtnSpinner, setErrBtnSpinner] = useState(false);
    //--------------------------------
    // functions COMMON
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
    // functions LOGIN
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
    const handleBlur =(me:any)=>{
        switch(me.target.name){
            case 'email':
                if(email!=='' && !emailInput.current.validity.valid)setEmailError('Debes introducir un email correcto');
                else setEmailError('');
                break;
            case 'pass':
                if(pass==='')setPassError('El password no puede estar vacio');
                else setPassError('');
                break;
        }
            if(emailInput.current.validity.valid && passInput.current.validity.valid)setCanSubmit(true);
            else setCanSubmit(false);   
    }
    const handleChange = (me:any)=>{
        switch(me.target.name){
            case 'email':
                setEmail(me.target.value);
                if(me.target.value.match(emailRegex) && passInput.current.validity.valid)setCanSubmit(true);
                else setCanSubmit(false);   
                break;
            case 'pass':
                setPass(me.target.value);
                if(emailInput.current.validity.valid && me.target.value!=='')setCanSubmit(true);
                else setCanSubmit(false);
                break;
        }
    }
    const handleEnter = (me:any) => {
        if(me.code === 'Enter'){
            if(canSubmit) submit();
        }
    }
    const submit = () => {
        console.log('submitting')
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
    // functions REGISTER
    const Reg_handleFocus =(me:any)=>{
        switch(me.target.name){
            case 'email':
                setReg_EmailError('');
                break;
            case 'pass':
                setReg_PassError('');
                break;
        }
    }
    const Reg_handleBlur =(me:any)=>{
        switch(me.target.name){
            case 'email':
                if(Reg_email!=='' && !Reg_emailInput.current.validity.valid)setReg_EmailError('Debes introducir un email correcto');
                else setReg_EmailError('');
                break;
            case 'pass':
                if(Reg_pass==='')setReg_PassError('El password no puede estar vacio');
                else setReg_PassError('');
                break;
        }
            if(Reg_emailInput.current.validity.valid && Reg_passInput.current.validity.valid)setReg_CanSubmit(false);
            else setReg_CanSubmit(true);   
    }
    const Reg_handleChange = (me:any)=>{
        switch(me.target.name){
            case 'email':
                setReg_Email(me.target.value);
                if(me.target.value.match(emailRegex) && Reg_passInput.current.validity.valid)setReg_CanSubmit(false);
                else setReg_CanSubmit(true);   
                break;
            case 'pass':
                setReg_Pass(me.target.value);
                if(Reg_emailInput.current.validity.valid && me.target.value!=='')setReg_CanSubmit(false);
                else setReg_CanSubmit(true);
                break;
        }
    }
    const Reg_handleEnter = (me:any) => {
        if(me.charCode= '13'){ // charCode #13 is enter
            console.log('llega')
        }
    }
    //--------------------------------
    //return jsx component
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
                    <label htmlFor="email">Email</label>
                    <div>
                        <input name='email' onKeyUp={handleEnter} onFocus={handleFocus} onBlur={handleBlur} ref={emailInput} required pattern={emailRegex} value={email} onChange={handleChange}/>
                        <span className='error'>{emailError}</span>
                    </div>
                    <label htmlFor="pass">Contraseña</label>
                    <div>
                        <input name='pass' onKeyUp={handleEnter} onFocus={handleFocus} onBlur={handleBlur} ref={passInput} required type='password' value={pass} onChange={handleChange}/>
                        <span className='error'>{passError}</span>
                    </div>
                    <Button type='submit' disabled={!canSubmit} className='espaciado' variant='primary' onClick={submit}>
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

                    <label htmlFor="email">Email</label>
                    <div>
                        <input name='email' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_emailInput} required pattern={emailRegex} value={Reg_email} onChange={Reg_handleChange}/>
                        <span className='error'>{Reg_emailError}</span>
                    </div>
                    <label htmlFor="pass">Contraseña</label>
                    <div>
                        <input name='pass' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_passInput} required type='password' value={Reg_pass} onChange={Reg_handleChange}/>
                        <span className='error'>{Reg_passError}</span>
                    </div>
                    <Button type='submit' disabled={Reg_canSubmit} className='espaciado' variant='primary' onClick={()=>
                        {
                            setReg_ErrBtnSpinner(true);
                            // register(email,pass,...)
                            // .then((res)=>{
                            //     if (res.code === 'ERR_NETWORK')setErrMessage('Fallo de conexión al servidor');
                            //     if (res.code === 'ERR_BAD_REQUEST')setErrMessage('Permiso denegado, comprueba los datos introducidos');
                            //     if (res.status === 200){
                            //         setSuccessMessage('Login realizado correctamente');
                            //         dispatch(setDueño({
                            //             token: res.data
                            //         }))
                            //     }
                            //     setErrBtnSpinner(false)
                            // });
                        }
                    }>
                        {Reg_errBtnSpinner? (
                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                            ):(<span>Register</span>)
                        }
                    </Button>
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