import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ProjectCard from "../project-card/ProjectCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject, updateproject } from "../../store/slice/project-slice";
import { toast } from "react-toastify";

// at the top of ProjectCard.test.jsx, before importing ProjectCard
jest.mock("../../store/slice/project-slice", () => ({
  deleteProject: jest.fn((payload) => ({ type: "DELETE_PROJECT", payload })),
  updateproject: jest.fn((payload) => ({ type: "UPDATE_PROJECT", payload })),
}));

// Mock Redux hooks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

// Mock Modal to always render children
jest.mock("react-modal", () => ({ children, isOpen }) =>
  isOpen ? <div data-testid="mock-modal">{children}</div> : null
);

describe("ProjectCard", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((callback) =>
      callback({
        auth: { userData: { isAdmin: true }, users: [{ _id: "1", name: "Alice" }] },
        projectsData: { projects: [{ _id: "p1", name: "Test Project", description: "Desc", startDate: "2025-01-01", endDate: "2025-12-31", ownerId: { _id: "1", name: "Alice" }, members: [] }] },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders ProjectCard with title, description, owner, date, and View Details button", () => {
    render(
      <ProjectCard
        id="p1"
        title="Test Project"
        description="Test Description"
        owner="Alice"
        createdAt="2025-01-01"
      />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("1/1/2025")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("opens modal when View Details is clicked", () => {
    render(
      <ProjectCard
        id="p1"
        title="Test Project"
        description="Test Description"
        owner="Alice"
        createdAt="2025-01-01"
      />
    );

    fireEvent.click(screen.getByText("View Details"));

    const modal = screen.getByTestId("mock-modal");
    expect(modal).toBeInTheDocument();

    // Scope queries to modal
    expect(within(modal).getByText("Test Project")).toBeInTheDocument();
    expect(within(modal).getByText("Desc")).toBeInTheDocument();
  });

  it("dispatches deleteProject when delete button is clicked", () => {
    render(
      <ProjectCard
        id="p1"
        title="Test Project"
        description="Test Description"
        owner="Alice"
        createdAt="2025-01-01"
      />
    );

    fireEvent.click(screen.getByText("View Details"));

    const modal = screen.getByTestId("mock-modal");
    const deleteButton = within(modal).getByRole("button", { name: /delete project/i });
    fireEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(deleteProject({ id: "p1" }));
  });
});
