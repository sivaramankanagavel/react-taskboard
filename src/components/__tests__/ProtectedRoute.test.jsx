import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../protected-route/ProtectedRoute.jsx";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  MemoryRouter: ({ children }) => <>{children}</>,
  Navigate: ({ to }) => <div>Redirected to {to}</div>,
}));

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders children if user is logged in", () => {
    useSelector.mockImplementation((fn) => fn({ auth: { isLoggedIn: true } }));
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /sign-in if user is not logged in", () => {
    useSelector.mockImplementation((fn) => fn({ auth: { isLoggedIn: false } }));
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Redirected to /sign-in")).toBeInTheDocument();
  });
});