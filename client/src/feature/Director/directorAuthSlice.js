import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    directorInfo: localStorage.getItem('directorInfo') ? JSON.parse(localStorage.getItem('directorInfo')) : null
}

const directorAuthSlice = createSlice({
    name: 'directorInfo',
    initialState,
    reducers: {
        setDirectorCredentials: (state, action) => {
            state.directorInfo = action.payload;
            localStorage.setItem('directorInfo', JSON.stringify(action.payload))
        },
        setDirectorToken:(state,action)=>{
            localStorage.setItem('directorToken', action.payload)
        },
        directorLogout: (state, action) => {
            state.directorInfo = null;
            localStorage.removeItem("directorInfo")
            localStorage.removeItem("directorToken")
        }
    }
});

export const { setDirectorCredentials,setDirectorToken, directorLogout } = directorAuthSlice.actions;

export default directorAuthSlice.reducer;