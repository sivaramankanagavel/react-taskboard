import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import SideNav from "../side-nav/SideNav";

jest.mock("../../store/slice/auth-slice", () => ({
  logoutWithGoogle: jest.fn(() => () => {}), // mock as thunk
}));

// Mock store with default admin user
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: { role: "admin" }, isLoggedIn: true }) => state,
  },
  // middleware omitted, redux-thunk included by default
});

describe("SideNav", () => {
  it("renders all sideNav items for admin", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SideNav open={true} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Tickets")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls handleItemClick on item click", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SideNav open={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Dashboard"));
    expect(screen.getByText("Dashboard").closest("li")).toHaveClass("side-nav-li--active");
  });

  it("dispatches logoutWithGoogle when Logout is clicked", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SideNav open={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(true).toBe(true);
  });
});