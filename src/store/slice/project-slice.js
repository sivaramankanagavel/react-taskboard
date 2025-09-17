import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  projects: [],
  isPending: false,
  isError: false,
};

// Async Thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PROJECTS_ENDPOINT}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to fetch projects");
    }
  }
);

// Async Thunk for adding a project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ projectData }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PROJECTS_ENDPOINT}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        }
      );
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
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PROJECTS_ENDPOINT}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        }
      );
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
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PROJECTS_ENDPOINT}/${id}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        }
      );
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
  reducers: {
  },
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