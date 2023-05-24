import { configureStore } from '@reduxjs/toolkit';
import dueñoSlice from './dueñoSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import perroSlice from './perroSlice';

const reducers = combineReducers({
    dueño: dueñoSlice,
    perros: perroSlice
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);


export default configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});