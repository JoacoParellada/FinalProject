// src/redux/empresasSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmpresa } from '../../types/dtos/empresa/IEmpresa';


interface EmpresasState {
    empresas: IEmpresa[];
}

const initialState: EmpresasState = {
    empresas: [],
};

const empresasSlice = createSlice({
    name: 'empresas',
    initialState,
    reducers: {
        setEmpresas(state, action: PayloadAction<IEmpresa[]>) {
        state.empresas = action.payload;
        },
        addEmpresa(state, action: PayloadAction<IEmpresa>) {
        state.empresas.push(action.payload);
        },
    },
});

export const { setEmpresas, addEmpresa } = empresasSlice.actions;
export default empresasSlice.reducer;