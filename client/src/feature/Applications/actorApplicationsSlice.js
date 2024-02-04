import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

const initialState = {
    loading: false,
    success: false,
    applications: [],
    error: ''
}

export const getActorApplications = createAsyncThunk('getActorApplications', async () => {
    const res = await axiosInstance.get("/actor/getactorapplications",{
        headers: {
            "Authorization": localStorage.getItem("actorToken")
        }
    })
    console.log(res.data);
    return res.data
})

const actorApplicationsSlice = createSlice({
    name: 'actorApplications',
    initialState,
    extraReducers: builder => {
        builder.addCase(getActorApplications.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getActorApplications.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.applications = action.payload
        })
        builder.addCase(getActorApplications.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })
    }
})

export default actorApplicationsSlice.reducer;