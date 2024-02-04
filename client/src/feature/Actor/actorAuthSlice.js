import { createSlice } from '@reduxjs/toolkit';

const storedActorInfo = localStorage.getItem('actorInfo');
const initialState = {
    actorInfo: storedActorInfo ? JSON.parse(storedActorInfo) : null
};

const actorAuthSlice = createSlice({
    name: 'actorInfo',
    initialState,
    reducers: {
        setActorCredentials: (state, action) => {
            state.actorInfo = action.payload;
            localStorage.setItem('actorInfo', JSON.stringify(action.payload))
        },
        setActorToken:(state,action)=>{
            localStorage.setItem('actorToken', action.payload)
        },
        actorLogout: (state, action) => {
            state.actorInfo = null;
            localStorage.removeItem("actorInfo");
            localStorage.removeItem("actorToken");
        }
    }
});

export const { setActorCredentials,setActorToken ,actorLogout } = actorAuthSlice.actions;

export default actorAuthSlice.reducer;