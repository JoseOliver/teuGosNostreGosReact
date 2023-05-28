import { createSlice } from '@reduxjs/toolkit'

interface Perro {
    num:number,
    nombre:string,
    fechaNacimiento:Date,
    anotaciones:string
}
let perroVacio:Perro = {
    num:-1,
    nombre:'',
    fechaNacimiento:new Date,
    anotaciones:''
}
export const perroSlice = createSlice({
    name: 'perros',
    initialState: {perros:[perroVacio], selected:-1},
    reducers: {
        setPerros: (state:any, action) => {
            return {
                ...state,
                ...action.payload
            }
        },
        resetPerros: () => {
        return {perros:[perroVacio], selected:-1};
        }
    }
});

export const { setPerros, resetPerros } = perroSlice.actions;
export const selectMyPerros = (state:any) => state.perros;
export const selectSelectedPerro = (state:any) => state.perros.selected;
export default perroSlice.reducer
