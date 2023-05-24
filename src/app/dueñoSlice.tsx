import { createSlice } from '@reduxjs/toolkit'

export interface Usuario {
  nombre?:string;
  apellido?:string;
  telefono?:string;
  email?:string;
  token?: string;
  edit?:boolean;
}
let UsuarioVacio:Usuario = {
  nombre:'',
  apellido:'',
  telefono:'',
  email:'',
  token: '',
}
export const dueñoSlice = createSlice({
  name: 'dueño',
  initialState: UsuarioVacio,
  reducers: {
    setDueño: (state:any, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
    resetDueño: () => {
      return {...UsuarioVacio};
    }
  }
});

export const { setDueño, resetDueño } = dueñoSlice.actions;
export const selectMe = (state:any) => state.dueño;
export const selectMyPerros = (state:any) => state.perros;
export default dueñoSlice.reducer
