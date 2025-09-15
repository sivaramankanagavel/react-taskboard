import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

// Mock the slice
jest.mock("../../store/slice/tasks-slice", () => ({
  addTicket: jest.fn((payload) => ({
    type: "ADD_TICKET",
    ...payload,
  })),
}));

import Tickets from "../tickets/Tickets";

// Mock KanbanBoard
jest.mock("../../components/kanban-board/KanbanBoard", () => () => (
  <div>KanbanBoard Mock</div>
));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
  ToastContainer: () => <div>ToastContainer Mock</div>,
}));

import Modal from "react-modal";
Modal.setAppElement(document.createElement("div"));

const mockStore = configureStore([]);
let store;

const renderComponent = () =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Tickets />
      </BrowserRouter>
    </Provider>
  );

describe("Tickets Component", () => {
  beforeEach(() => {
    store = mockStore({
      auth: {
        userData: { id: "u1", name: "User One", isAdmin: true, isTaskCreator: false },
        users: [{ _id: "u2", name: "User Two" }],
      },
      projectsData: {
        projects: [{ _id: "p1", name: "Project One" }],
      },
      tasks: { tickets: [] },
    });
    store.dispatch = jest.fn();
  });

  it("renders header and Add Task button", () => {
    renderComponent();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("+ Add Task")).toBeInTheDocument();
  });

  it("opens modal when Add Task button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("+ Add Task"));
    expect(screen.getByText(/Add New Ticket/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows error toast if form is incomplete", async () => {
    const { toast } = require("react-toastify");
    renderComponent();
    fireEvent.click(screen.getByText("+ Add Task"));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields!", expect.any(Object))
    );
  });

  it("dispatches addTicket and shows success toast on valid form submission", async () => {
    const { toast } = require("react-toastify");
    renderComponent();

    fireEvent.click(screen.getByText("+ Add Task"));

    fireEvent.change(screen.getByLabelText(/Ticket Name\*/i), { target: { value: "Test Ticket" } });
    fireEvent.change(screen.getByLabelText(/Description\*/i), { target: { value: "Test Description" } });
    fireEvent.change(screen.getByLabelText(/Start Date\*/i), { target: { value: "2025-09-15" } });
    fireEvent.change(screen.getByLabelText(/Due Date\*/i), { target: { value: "2025-09-20" } });
    fireEvent.change(screen.getByLabelText(/Assignee ID\*/i), { target: { value: "u2" } });
    fireEvent.change(screen.getByLabelText(/Project ID\*/i), { target: { value: "p1" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: "ADD_TICKET",
        ticketData: {
          name: "Test Ticket",
          description: "Test Description",
          startDate: "2025-09-15",
          dueDate: "2025-09-20",
          assigneeId: "u2",
          projectId: "p1",
        },
      });
      expect(toast.success).toHaveBeenCalledWith("Ticket added successfully!", expect.any(Object));
    });
  });

  it("filters tickets by project", () => {
    renderComponent();
    const select = screen.getByLabelText(/Filter by Project/i);
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "p1" } });
    expect(select.value).toBe("p1");
  });
});
