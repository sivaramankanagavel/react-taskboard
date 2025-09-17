import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  projects: [],
  isPending: false,
  isError: false,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await api.get(import.meta.env.VITE_PROJECTS_ENDPOINT);
    return response?.data;
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ projectData }, { dispatch }) => {
    try {
      const response = await api.post(import.meta.env.VITE_PROJECTS_ENDPOINT, projectData);
      dispatch(fetchProjects());
      return response.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to add project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ({ id }, { dispatch }) => {
    try {
      const response = await api.delete(`${import.meta.env.VITE_PROJECTS_ENDPOINT}/${id}`);
      dispatch(fetchProjects());
      return response.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to delete project");
    }
  }
);

export const updateproject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, projectData }, { dispatch }) => {
    try {
      const response = await api.put(`${import.meta.env.VITE_PROJECTS_ENDPOINT}/${id}`, projectData);
      dispatch(fetchProjects());
      return response.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to update project");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isPending = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(addProject.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(addProject.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(addProject.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(deleteProject.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(deleteProject.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(updateproject.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateproject.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(updateproject.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      });
  },
});

export default projectSlice;