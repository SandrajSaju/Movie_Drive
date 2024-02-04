import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

const initialState = {
    loading: false,
    success: false,
    actorDetails: '',
    error: ''
}

export const getActorDetails = createAsyncThunk('getActorDetails', async (actorId) => {
    const { data } = await axiosInstance.get(`/director/getactordetails/${actorId}`,{
        headers: {
            "Authorization": localStorage.getItem("directorToken")
        }
    });
    return data
})


const directorActorSlice = createSlice({
    name: 'getActorDetails',
    initialState,
    extraReducers: builder => {
        builder.addCase(getActorDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getActorDetails.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.actorDetails = action.payload
        })
        builder.addCase(getActorDetails.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })
    }
})

export default directorActorSlice.reducer