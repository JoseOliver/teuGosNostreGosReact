import { Navbar, Nav, Container, NavDropdown, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe, setDueño, resetDueño } from '../../app/dueñoSlice';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState } from 'react';

export const Navig = (props:any) => {
    const navigate = useNavigate();
    const dueño:any = useSelector(selectMe);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState('');
    const navigateFunc = (url:string) => {
        if (!props.savePerfilProps.EditarPerfil) navigate(url);
        else {
            setUrl(url);
            setShowModal(true);
        }
    }
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                <Navbar.Brand className='clicable' onClick={()=>navigateFunc('/')}>El Teu gos<br></br>El Nostre gos</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {dueño.token === '' ? (
                        <NavDropdown title="Autenticación" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=>navigateFunc('/auth/login')}>Login</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>navigateFunc('/auth/registro')}>Registro</NavDropdown.Item>
                        </NavDropdown>

                    ):(
                        <>
                            <NavDropdown title="perfil" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={()=>navigateFunc('/perfil/usuario')}>Usuario</NavDropdown.Item>
                                <NavDropdown.Item onClick={()=>navigateFunc('/perfil/dueño')}>Dueño</NavDropdown.Item>
                            </NavDropdown>
                        </>
                        // <Nav.Link onClick={()=>navigate('/perfil')}>Perfil</Nav.Link>
                            // {/* <NavDropdown.Divider /> */}
                    )}
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
                <Modal show={showModal} onHide={()=>setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Guardar cambios efectuados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Tienes cambios editados sin guardar</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{
                            props.savePerfilProps.setGuardarPerfil(true);
                            setShowModal(false);
                            setTimeout(()=>{navigate(url)},2000);
                            }}>
                            Guardar cambios
                        </Button>
                        <Button variant="primary" onClick={()=>{
                            props.savePerfilProps.setEditarPerfil(false);
                            setShowModal(false);
                            navigate(url);
                        }}>
                            Cancelar cambios y navegar
                        </Button>
                    </Modal.Footer>
                </Modal>
        </>
    )
}