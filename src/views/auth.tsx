import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectMe, setDueño, resetDueño } from '../app/dueñoSlice'
import { Button, Nav, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import * as dayjs from 'dayjs'
import { getMe, login, register } from '../services/apiCalls';
import { useNavigate } from 'react-router-dom';

const Auth = (props:any) => {
    //#region common hooks and variables fold
    //LOGIN
    const navigate = useNavigate();
    const dueño = useSelector(selectMe);
    const dispatch = useDispatch();
    const [page, setPage] = useState(props.page);
    //login or registro selector '1' or '2'
    const [visibleDiv, setVisibleDiv] = useState('');
    //login values
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const emailInput:any = useRef();
    const passInput:any = useRef();
    //submit switch
    const [canSubmit, setCanSubmit] = useState(false);
    //error button spinner
    const [Reg_errBtnSpinner, setReg_ErrBtnSpinner] = useState(false);
    //error
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    //regex
    const emailRegex = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    //dayjs
    let now = dayjs();
    //REGISTRO
    const [Reg_email, setReg_Email] = useState('');
    const [Reg_pass, setReg_Pass] = useState('');
    const [Reg_nombre, setReg_Nombre] = useState('');
    const [Reg_apellido, setReg_Apellido] = useState('');
    const [Reg_telefono, setReg_Telefono] = useState('');
    const Reg_emailInput:any = useRef();
    const Reg_passInput:any = useRef();
    const Reg_nombreInput:any = useRef();
    const Reg_apellidoInput:any = useRef();
    const Reg_telefonoInput:any = useRef();
    const [Reg_emailError, setReg_EmailError] = useState('');
    const [Reg_passError, setReg_PassError] = useState('');
    const [Reg_nombreError, setReg_NombreError] = useState('');
    const [Reg_apellidoError, setReg_ApellidoError] = useState('');
    const [Reg_telefonoError, setReg_TelefonoError] = useState('');
    const [Reg_canSubmit, setReg_CanSubmit] = useState(false);
    const [errBtnSpinner, setErrBtnSpinner] = useState(false);
    //#endregion
    //--------------------------------
    //#region login stuff fold
    
    //COMMON
    const select = (me:any) => {
        setPage(me);
        setVisibleDiv(me);
        if(me === '1')
        navigate('/auth/login');
        else 
        navigate('/auth/registro');
    }
    useEffect(()=>{
        if(props.page !== page) select(props.page);
        else setVisibleDiv(props.page);
    },[props.page]);
    //FUNCTIONS
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
        setErrBtnSpinner(true);
        login(email,pass)
        .then((res)=>{
            if (res.code === 'ERR_NETWORK')props.messageProps.setErrMessage('Fallo de conexión al servidor');
            if (res.code === 'ERR_BAD_REQUEST')props.messageProps.setErrMessage('Permiso denegado, comprueba los datos introducidos');
            if (res.status === 200){
                props.messageProps.setSuccessMessage('Login realizado correctamente');
                let token= res.data;
                dispatch(setDueño({
                    token: token
                }))
                getMe(token)
                .then((res:any)=>{
                    dispatch(setDueño({
                        ...res.data.data
                    }));
                    setTimeout(()=>navigate('/'),2000);
                })
                .catch((error)=>{props.messageProps.setErrMessage(error)});
            }
            setErrBtnSpinner(false);
        });
    }
    //#endregion
    //#region register stuff fold
    //FUNCTIONS
    const Reg_handleFocus =(me:any)=>{
        switch(me.target.name){
            case 'email':
                setReg_EmailError('');
                break;
            case 'pass':
                setReg_PassError('');
                break;
            case 'nombre':
                setReg_NombreError('');
                break;
            case 'apellido':
                setReg_ApellidoError('');
                break;
            case 'telefono':
                setReg_TelefonoError('');
                break;
        }
    }
    const Reg_handleBlur =(me:any)=>{
        switch(me.target.name){
            case 'email':
                if(Reg_email===''){
                    setReg_EmailError('El email no puede estar vacio');
                    break;
                }
                if(Reg_email!=='' && !Reg_emailInput.current.value.match(emailRegex))setReg_EmailError('Debes introducir un email correcto');
                else setReg_EmailError('');
                break;
            case 'pass':
                if(Reg_pass==='')setReg_PassError('El password no puede estar vacio');
                else setReg_PassError('');
                break;
            case 'nombre':
                if(Reg_nombre==='')setReg_NombreError('El nombre no puede estar vacio');
                else setReg_NombreError('');
                break;
            case 'apellido':
                if(Reg_apellido==='')setReg_ApellidoError('El apellido no puede estar vacio');
                else setReg_ApellidoError('');
                break;
            case 'telefono':
                if(Reg_telefono==='')setReg_TelefonoError('El telefono no puede estar vacio');
                else setReg_TelefonoError('');
                break;
        }
            if(Reg_emailInput.current.validity.valid &&
                Reg_passInput.current.validity.valid &&
                Reg_nombreInput.current.validity.valid &&
                Reg_apellidoInput.current.validity.valid &&
                Reg_telefonoInput.current.validity.valid
            )
                setReg_CanSubmit(true);
            else setReg_CanSubmit(false);   
    }
    const Reg_handleChange = (me:any)=>{
        switch(me.target.name){
            case 'email':
                setReg_Email(me.target.value);
                if(me.target.value.match(emailRegex) && // email condicion
                    Reg_passInput.current.validity.valid &&
                    Reg_nombreInput.current.validity.valid &&
                    Reg_apellidoInput.current.validity.valid &&
                    Reg_telefonoInput.current.validity.valid
                )
                    setReg_CanSubmit(true);
                else setReg_CanSubmit(false);   
                break;
            case 'pass':
                setReg_Pass(me.target.value);
                if(Reg_emailInput.current.validity.valid &&
                    me.target.value!=='' && // pass condicion
                    Reg_nombreInput.current.validity.valid &&
                    Reg_apellidoInput.current.validity.valid &&
                    Reg_telefonoInput.current.validity.valid
                )
                    setReg_CanSubmit(true);
                else setReg_CanSubmit(false);
                break;
            case 'nombre':
                setReg_Nombre(me.target.value);
                if(Reg_emailInput.current.validity.valid &&
                    Reg_passInput.current.validity.valid &&
                    me.target.value!=='' && // nombre condicion
                    Reg_apellidoInput.current.validity.valid &&
                    Reg_telefonoInput.current.validity.valid
                )
                    setReg_CanSubmit(true);
                else setReg_CanSubmit(false);
                break;
            case 'apellido':
                setReg_Apellido(me.target.value);
                if(Reg_emailInput.current.validity.valid &&
                    Reg_passInput.current.validity.valid &&
                    Reg_nombreInput.current.validity.valid &&
                    me.target.value!=='' && // apellido condicion
                    Reg_telefonoInput.current.validity.valid
                )
                    setReg_CanSubmit(true);
                else setReg_CanSubmit(false);
                break;
            case 'telefono':
                setReg_Telefono(me.target.value);
                if(Reg_emailInput.current.validity.valid &&
                    Reg_nombreInput.current.validity.valid &&
                    Reg_apellidoInput.current.validity.valid &&
                    me.target.value!==''
                )
                    setReg_CanSubmit(true);
                else setReg_CanSubmit(false);
                break;
        }
    }
    const Reg_handleEnter = (me:any) => {
        if(me.code === 'Enter'){
            if(Reg_canSubmit) Reg_submit();
        }
    }
    const resetRegistro = () => {
        setReg_Nombre('');
        setReg_Apellido('');
        setReg_Telefono('');
        setReg_Email('');
        setReg_Pass('');

        setReg_NombreError('');
        setReg_ApellidoError('');
        setReg_TelefonoError('');
        setReg_EmailError('');
        setReg_PassError('');
    }
    const Reg_submit = () => {
        setErrBtnSpinner(true);
        register(Reg_nombre,Reg_apellido,Reg_telefono,Reg_email,Reg_pass)
        .then((res)=>{
            if (res.code === 'ERR_NETWORK')props.messageProps.setErrMessage('Fallo de conexión al servidor');
            if (res.code === 'ERR_BAD_REQUEST')props.messageProps.setErrMessage('Permiso denegado, comprueba los datos introducidos');
            if (res.code === 'ERR_BAD_RESPONSE'){
                if( res.response.data.success=== false ){
                    props.messageProps.setErrMessage(res.response.data.message);
                }
            }
            if (res.status == 200){
                props.messageProps.setSuccessMessage('Registro realizado correctamente');
                resetRegistro();
                navigate('/auth/login');
            }
            setErrBtnSpinner(false);
        });
    }
    //#endregion
    //--------------------------------
    //jsx component
    return ( //fold
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
            { visibleDiv === '1' && dueño.token === '' && (
                <div className="espaciado">
                    <h4>Login</h4>
                    <div className='login flex'>
                        <label htmlFor="email" className='tabulado'>Email</label>
                        <div>
                            <input name='email' className='espaciado redondeado' onKeyUp={handleEnter} onFocus={handleFocus} onBlur={handleBlur} ref={emailInput} required type='email' value={email} onChange={handleChange}/>
                            <span className='error'>{emailError}</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pass" className='tabulado'>Contraseña</label>
                        <div>
                            <input name='pass' className='espaciado redondeado' onKeyUp={handleEnter} onFocus={handleFocus} onBlur={handleBlur} ref={passInput} required type='password' value={pass} onChange={handleChange}/>
                            <span className='error'>{passError}</span>
                        </div>
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
            { visibleDiv === '1' && dueño.token !=='' && (
                <>
                    <div>Bienvenido de nuevo {dueño.nombre}</div>
                </>
            )}
            { visibleDiv === '2' && (
                <>
                    <div className='register espaciado'>
                        <h4>Registro</h4>
                        <label htmlFor="nombre">Nombre</label>
                        <div>
                            <input name='nombre' className='espaciado redondeado' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_nombreInput} required value={Reg_nombre} onChange={Reg_handleChange}/>
                            <span className='error'>{Reg_nombreError}</span>
                        </div>
                        <label htmlFor="apellido">Apellido</label>
                        <div>
                            <input name='apellido' className='espaciado redondeado' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_apellidoInput} required value={Reg_apellido} onChange={Reg_handleChange}/>
                            <span className='error'>{Reg_apellidoError}</span>
                        </div>
                        <label htmlFor="telefono">Telefono</label>
                        <div>
                            <input name='telefono' className='espaciado redondeado' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_telefonoInput} required value={Reg_telefono} onChange={Reg_handleChange}/>
                            <span className='error'>{Reg_telefonoError}</span>
                        </div>
                        <label htmlFor="email">Email</label>
                        <div>
                            <input name='email' className='espaciado redondeado' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} type='email' ref={Reg_emailInput} required value={Reg_email} onChange={Reg_handleChange}/>
                            <span className='error'>{Reg_emailError}</span>
                        </div>
                        <label htmlFor="pass">Contraseña</label>
                        <div>
                            <input name='pass' className='espaciado redondeado' onKeyUp={Reg_handleEnter} onFocus={Reg_handleFocus} onBlur={Reg_handleBlur} ref={Reg_passInput} required type='password' value={Reg_pass} onChange={Reg_handleChange}/>
                            <span className='error'>{Reg_passError}</span>
                        </div>
                        <Button type='submit' disabled={!Reg_canSubmit} className='espaciado' variant='primary' onClick={Reg_submit}>
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
                </>
            )}
        </div>
    )
}

export default Auth