import axios from 'axios';
import { decodeToken } from 'react-jwt';
const root='http://localhost:3000/';

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
