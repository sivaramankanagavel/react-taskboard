import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth-slice";
import projectSlice from "./slice/project-slice";
import ticketsSlice from "./slice/tasks-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projectsData: projectSlice.reducer,
    ticketsData: ticketsSlice.reducer,
  },
});

export default store;