import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";

const ticketInitialState = {
  tickets: [],
  allTickets: [],
  isError: false,
  isPending: false,
  projectId: null,
};

export const getAllTickets = createAsyncThunk(
  "tickets/getAllTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(import.meta.env.VITE_API_TICKETS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTickets = createAsyncThunk(
  "tickets/getTickets",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_TICKETS_AND_PROJECTS}/${projectId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ ticketId, updatedData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(
        `${import.meta.env.VITE_API_TICKETS}/${ticketId}`,
        updatedData
      );
      dispatch(getAllTickets());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async ({ ticketData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(import.meta.env.VITE_API_TICKETS, ticketData);
      dispatch(getAllTickets());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async ({ ticketId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${import.meta.env.VITE_API_TICKETS}/${ticketId}`
      );
      dispatch(getAllTickets());
      return response.data;
    } catch (error) {
      if (error.response.data.message === "Not authorized to delete this task") {
        toast.error("You are not authorized to delete this task!", {
          position: "bottom-center",
          autoClose: 5000,
        });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: ticketInitialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.projectId = action.meta.arg.projectId;
        state.isPending = false;
        state.isError = false;
      })
      .addCase(getTickets.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(getAllTickets.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.allTickets = action.payload;
        state.isPending = false;
        state.isError = false;
      })
      .addCase(getAllTickets.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(updateTicketStatus.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateTicketStatus.fulfilled, (state) => {
        state.isPending = false;
        state.isError = false;
      })
      .addCase(updateTicketStatus.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(addTicket.pending, (state) => {
        state.isPending = true;
      })
      .addCase(addTicket.fulfilled, (state) => {
        state.isPending = false;
        state.isError = false;
      })
      .addCase(addTicket.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteTicket.fulfilled, (state) => {
        state.isPending = false;
        state.isError = false;
      })
      .addCase(deleteTicket.rejected, (state) => {
        state.isError = true;
        state.isPending = false;
      });
  },
});

export default ticketSlice;