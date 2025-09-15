import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import "@testing-library/jest-dom";
import Modal from "react-modal";
import KanbanBoard from "../kanban-board/KanbanBoard.jsx";
import { updateTicketStatus, deleteTicket } from "../../store/slice/tasks-slice.js";

beforeAll(() => {
  Modal.setAppElement(document.createElement("div"));
});

jest.mock("../../store/slice/tasks-slice", () => ({
  updateTicketStatus: jest.fn(() => () => Promise.resolve({ type: "mock/update" })),
  getAllTickets: jest.fn(() => ({ type: "mock/getAll" })),
  deleteTicket: jest.fn(() => () => Promise.resolve({ type: "mock/delete" })),
}));

jest.mock("@hello-pangea/dnd", () => {
  const original = jest.requireActual("@hello-pangea/dnd");
  return {
    ...original,
    DragDropContext: jest.fn(({ children, onDragEnd }) => (
      <div data-testid="dnd-context">{children}</div>
    )),
    Droppable: ({ children }) => (
      <div>{children({ innerRef: jest.fn(), droppableProps: {} })}</div>
    ),
    Draggable: ({ children }) => (
      <div>
        {children({
          innerRef: jest.fn(),
          draggableProps: {},
          dragHandleProps: {},
        })}
      </div>
    ),
  };
});

const mockStore = configureStore([thunk]);

describe("KanbanBoard Component", () => {
  const baseState = {
    ticketsData: {
      allTickets: [
        {
          _id: "1",
          name: "Test Ticket",
          description: "Desc",
          status: "NOT_STARTED",
          assigneeId: { _id: "u1", name: "John" },
          projectId: { _id: "p1", name: "Project A" },
          dueDate: "2025-09-20",
        },
      ],
      isPending: false,
    },
    auth: {
      userData: { isAdmin: true, userId: "u1" },
      users: [{ _id: "u1", name: "John" }],
    },
    projectsData: {
      projects: [{ _id: "p1", name: "Project A" }],
    },
  };

  const renderWithStore = (stateOverrides = {}) => {
    const store = mockStore({ ...baseState, ...stateOverrides });
    return render(
      <Provider store={store}>
        <KanbanBoard selectedProject="all" />
      </Provider>
    );
  };

  it("renders a ticket in the correct column", () => {
    renderWithStore();

    expect(screen.getByText("Test Ticket")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("shows loading overlay when isPending is true", () => {
    renderWithStore({
      ticketsData: { ...baseState.ticketsData, isPending: true },
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("opens modal when clicking View Details", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("View Details"));
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("dispatches deleteTicket when delete button is clicked", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("View Details"));

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons.find((btn) => btn.innerHTML.includes("lucide-trash")));

    expect(deleteTicket).toHaveBeenCalledWith({ ticketId: "1" });
  });

  it("dispatches updateTicketStatus on drag end", () => {
    renderWithStore();

    const { DragDropContext } = require("@hello-pangea/dnd");
    const result = {
      source: { droppableId: "NOT_STARTED" },
      destination: { droppableId: "IN_PROGRESS" },
      draggableId: "1",
    };
    DragDropContext.mock.calls[0][0].onDragEnd(result);

    expect(updateTicketStatus).toHaveBeenCalled();
  });
});
