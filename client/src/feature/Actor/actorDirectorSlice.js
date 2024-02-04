import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

const initialState = {
    loading: false,
    success: false,
    directors: [],
    error: ''
}

export const getAllDirectors = createAsyncThunk('getAllDirectors', async () => {
    const { data } = await axiosInstance.get('/actor/getalldirectors', {
        headers: {
            "Authorization": localStorage.getItem("actorToken")
        }
    });
    return data
})

export const getSearchedDirectors = createAsyncThunk('getSearchedDirectors', async (text) => {
    return await axiosInstance.post('/actor/getsearcheddirectors', { text }, {
        headers: {
            "Authorization": localStorage.getItem("actorToken")
        }
    })
        .then(response => response.data)
})

const actorDirectorSlice = createSlice({
    name: 'getAllDirectors',
    initialState,
    extraReducers: builder => {
        builder.addCase(getAllDirectors.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllDirectors.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.directors = action.payload
        })
        builder.addCase(getAllDirectors.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })

        builder.addCase(getSearchedDirectors.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getSearchedDirectors.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.directors = action.payload
        })
        builder.addCase(getSearchedDirectors.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.error.message
        })
    }
})

export default actorDirectorSlice.reducer