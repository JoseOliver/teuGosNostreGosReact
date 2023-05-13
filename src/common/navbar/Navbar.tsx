import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { selectMe, setDueño, resetDueño } from '../../app/dueñoSlice'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

export const Navig = () => {
    const navigate = useNavigate();
    const dueño:any = useSelector(selectMe);
    const dispatch = useDispatch();
    return (
        <Navbar bg="light" expand="lg">
            <Container>
            <Navbar.Brand className='clicable' onClick={()=>navigate('/')}>El Teu gos<br></br>El Nostre gos</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                {dueño.dueño.token === '' ? (
                    <NavDropdown title="Autenticación" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={()=>navigate('/auth/login')}>Login</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>navigate('/auth/registro')}>Registro</NavDropdown.Item>
                    </NavDropdown>

                ):(
                    <Nav.Link onClick={()=>navigate('/perfil')}>Perfil</Nav.Link>
                        // {/* <NavDropdown.Divider /> */}
                )}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}