import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth-slice";
import projectSlice from "./slice/project-slice";
import ticketsSlice from "./slice/tasks-slice";
import { setupInterceptors } from "../utils/api";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projectsData: projectSlice.reducer,
    ticketsData: ticketsSlice.reducer,
  },
});

// Call the setup function and pass the store to it
setupInterceptors(store);

export default store;