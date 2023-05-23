import axios from 'axios';
import { decodeToken } from 'react-jwt';
const root='http://localhost:3000/';

type Usuario = {
    changes:{
        nombre:string,
        apellido:string,
        telefono:string,
        email:string,
        contraseña?:string

    }
}
export const login= async ( email:string , pass:string ) => {
    try {
        let body = {
            email: email,
            contraseña: pass
        };
        let res:any = await axios.post(`${root}auth/login`, body);
        return res;
    } catch (error:any) {
        return error;
    }
}
export const register= async (nombre:string, apellido:string, telefono:string, email:string, pass:string) => {
    try {
        let body = {
            props:{
                nombre: nombre,
                apellido: apellido,
                telefono: telefono,
                email: email,
                contraseña: pass
            }
        }
        let res:any = await axios.post(`${root}auth/register`, body)
        return res;
    } catch (error) {
        return error;
    }
}
export const getMe= async (token:string) => {
    try {
        let config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        let res:any = await axios.get(`${root}usuario/yo`,config);
        return res;
    } catch (error) {
        return error;
    }
}
export const setMe= async (props:any) => {
    try {
        let config = {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        };
        let body:Usuario = {
            changes:{
                nombre: props.nombre,
                apellido: props.apellido,
                telefono: props.telefono,
                email: props.email
            }
        };
        if(props.pass !== '')body.changes.contraseña= props.pass;
        // if(props.pass === '***')console.log("ahora ha sido cuanddo habia que borrar");
        let res:any = await axios.post(`${root}usuario/yo`,body,config);
        return res;
    } catch (error) {
        return error;
    }
}
