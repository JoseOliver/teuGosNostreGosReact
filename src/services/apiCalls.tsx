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

// let config = {
//     headers: {
//         Authorization: 'Bearer ' + token
//     }
// }