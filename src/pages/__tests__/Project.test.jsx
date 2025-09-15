import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// MOCK addProject so import.meta.env is never executed
jest.mock("../../store/slice/project-slice", () => ({
  addProject: jest.fn(() => ({ type: "mock/addProject" })),
}));

// Mock ProjectCard
jest.mock("../../components/project-card/ProjectCard", () => ({ title }) => (
  <div data-testid="project-card">{title}</div>
));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: ({ children }) => <div>{children}</div>,
}));

import Projects from "../projects/Project";

describe("Projects page", () => {
  let store;
  const mockUsers = [
    { _id: "u1", name: "User One", createdAt: "2025-01-01" },
    { _id: "u2", name: "User Two", createdAt: "2025-01-02" },
  ];

  const mockProjects = [
    { id: "p1", name: "Project Alpha", description: "Desc Alpha", ownerId: mockUsers[0] },
    { id: "p2", name: "Project Beta", description: "Desc Beta", ownerId: mockUsers[1] },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projectsData: (state = { projects: mockProjects }) => state,
        auth: (state = { users: mockUsers, userData: { isAdmin: true } }) => state,
      },
    });

    store.dispatch = jest.fn();
  });

  it("renders header and Add Project button for admin", () => {
    render(
      <Provider store={store}>
        <Projects />
      </Provider>
    );

    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+ Add Project/i })).toBeInTheDocument();
  });

  it("renders project cards", () => {
    render(
      <Provider store={store}>
        <Projects />
      </Provider>
    );

    const cards = screen.getAllByTestId("project-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Project Alpha");
    expect(cards[1]).toHaveTextContent("Project Beta");
  });
});
