import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskCard from "../task-card/TaskCard";
import { useDispatch, useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../store/slice/tasks-slice", () => ({
  deleteTicket: jest.fn((payload) => ({ type: "DELETE_TICKET", payload })),
}));

describe("TaskCard", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ auth: { userData: { isAdmin: true } } })
    );
  });

  const taskProps = {
    title: "Test Task",
    description: "This is a test description",
    assignee: "John Doe",
    createdAt: "2025-09-14T10:00:00Z",
    ticketId: 1,
  };

  it("renders task details correctly", () => {
    render(<TaskCard {...taskProps} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("14/9/2025")).toBeInTheDocument();
  });

  it("shows delete button for admin", () => {
    render(<TaskCard {...taskProps} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("dispatches deleteTicket action on delete button click", () => {
    render(<TaskCard {...taskProps} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "DELETE_TICKET",
      payload: { ticketId: 1 },
    });
  });
});
