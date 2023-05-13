import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import { Navig } from './common/navbar/Navbar';
import { Home } from './views/home';
import { Perfil } from './views/Perfil';
import Auth from './views/auth';

function App(): JSX.Element {
  return (
    <>
      <Navig></Navig>
      <Routes>
        <Route element={<Home></Home>} path='/'></Route>
        <Route element={<Auth page='1'></Auth>} path='/auth/login'></Route>
        <Route element={<Auth page='2'></Auth>} path='/auth/registro'></Route>
        <Route element={<Perfil></Perfil>} path='/perfil'></Route>
      </Routes>
    </>
  )
}

export default App
