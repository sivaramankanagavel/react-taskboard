import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const ticketInitialState = {
  tickets: [],
  allTickets: [],
  isError: false,
  isPending: false,
  projectId: null,
};

const ticketSlice = createSlice({
  name: "get-task-based-on-projects",
  initialState: ticketInitialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.projectId = action.meta.arg.projectId;
        state.isPending = false;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isError = true;
      })
      .addCase(getAllTickets.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.allTickets = action.payload;
        state.isPending = false;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(updateTicketStatus.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isPending = false;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(addTicket.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.isPending = false;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.isError = true;
        state.isPending = false;
      })
      .addCase(deleteTicket.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isPending = false;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isError = true;
        state.isPending = false;
      });
    }
});

export default ticketSlice;

export const getAllTickets = createAsyncThunk(
  "get the ticket based on userId",
  async () => {
    return axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TICKETS}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const getTickets = createAsyncThunk(
  "get the ticket based on userId and ProjectId",
  async ({ projectId }) => {
    return axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TICKETS_AND_PROJECTS}/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const updateTicketStatus = createAsyncThunk(
  "Update Ticket Status",
  async ({ ticketId, updatedData }, { dispatch }) => {
    return axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TICKETS}/${ticketId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        dispatch(getAllTickets());
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const addTicket = createAsyncThunk("Create Ticket", async ({ ticketData }, { dispatch }) => {
  return axios
    .post(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TICKETS}`,
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
    .then((result) => {
      dispatch(getAllTickets());
      return result?.data;
    })
    .catch((error) => error);
});

export const deleteTicket = createAsyncThunk("Delete Ticket", async ({ ticketId }, { dispatch }) => {
  return axios
    .delete(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TICKETS}/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
    .then((result) => {
      dispatch(getAllTickets());
      return result?.data;
    })
    .catch((error) => {
      if(error.message === "Not authorized to delete this task") {
        toast.error("You are not authorized to delete this task!", {
          position: "bottom-center",
          autoClose: 5000,
        });
      }
    });
});
