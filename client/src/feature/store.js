import { configureStore } from "@reduxjs/toolkit";
import actorAuthSlice from "./Actor/actorAuthSlice";
import directorAuthSlice from "./Director/directorAuthSlice";
import castingCallsSlice from "./CastingCalls/castingCallsSlice";
import adminAuthSlice from "./Admin/adminAuthSlice";
import actorApplicationsSlice from "./Applications/actorApplicationsSlice";
import actorDirectorSlice from "./Actor/actorDirectorSlice";
import directorActorSlice from "./Director/directorActorSlice";

const store = configureStore({
    reducer:{
        actorAuth:actorAuthSlice,
        directorAuth:directorAuthSlice,
        adminAuth:adminAuthSlice,
        castingCalls:castingCallsSlice,
        actorApplications:actorApplicationsSlice,
        actorDirectors:actorDirectorSlice,
        actorDetails:directorActorSlice
    }
})

export default store;