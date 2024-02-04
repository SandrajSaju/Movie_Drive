import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

const initialState = {
    loading: false,
    success: false,
    castingCalls: [],
    error: ''
}

export const getCastingCalls = createAsyncThunk('getCastingCall', async () => {
    const res = await axiosInstance.get("/director/getcastingcalls",{
        headers:{
            "Authorization": localStorage.getItem("directorToken")
        }
    })
    return res.data
})

export const deleteCastingCall = createAsyncThunk('deleteCastingCall', async (id) => {
    return await axiosInstance.delete(`/director/deletecastingcall/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem("directorToken")
        }
    })
})

export const recoverCastingCall = createAsyncThunk('recoverCastingCall', async (id) => {
    return await axiosInstance.delete(`/director/recovercastingcall/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem("directorToken")
        }
    })
})


export const editCastingCall = createAsyncThunk('editCastingCall', async ({ id, editedCastingCall }) => {
    return await axiosInstance.put(`/director/editcastingcall/${id}`, editedCastingCall, {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": localStorage.getItem("directorToken")
        }
    })
})

export const actorDetailedCastingCall = createAsyncThunk('viewDetails', async (id) => {
    const { data } = await axiosInstance.get(`/actor/viewdetailedcastingcall/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem("actorToken")
        }
    });
    return data
})

const castingCallsSlice = createSlice({
    name: 'castingCall',
    initialState,
    extraReducers: builder => {
        builder.addCase(deleteCastingCall.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteCastingCall.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        builder.addCase(deleteCastingCall.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })

        builder.addCase(recoverCastingCall.pending, (state) => {
            state.loading = true
        })
        builder.addCase(recoverCastingCall.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        builder.addCase(recoverCastingCall.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })

        builder.addCase(getCastingCalls.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCastingCalls.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.castingCalls = action.payload
        })
        builder.addCase(getCastingCalls.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })

        builder.addCase(editCastingCall.pending, (state) => {
            state.loading = true
        })
        builder.addCase(editCastingCall.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        builder.addCase(editCastingCall.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })

        builder.addCase(actorDetailedCastingCall.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actorDetailedCastingCall.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.castingCalls = action.payload
        })
        builder.addCase(actorDetailedCastingCall.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })
    }
})

export default castingCallsSlice.reducer