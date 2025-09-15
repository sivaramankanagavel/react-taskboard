import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import SignIn from "../sign-in/SignIn";
import { BrowserRouter as Router } from "react-router-dom";

// Mock react-redux
jest.mock("react-redux", () => {
  return {
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  };
});

// Mock react-router-dom
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn()
  };
});

// Mock auth-slice functions inside the factory
jest.mock("../../store/slice/auth-slice", () => {
  return {
    loginWithGoogle: jest.fn(() => ({ type: "LOGIN_WITH_GOOGLE" })),
    loginEndPointAsyncFunc: jest.fn((payload) => ({ type: "LOGIN_END_POINT_ASYNC_FUNC", payload }))
  };
});

// Mock project and tasks slice functions
jest.mock("../../store/slice/project-slice", () => ({
  fetchProjects: jest.fn(() => ({ type: "FETCH_PROJECTS" }))
}));

jest.mock("../../store/slice/tasks-slice", () => ({
  getAllTickets: jest.fn(() => ({ type: "GET_ALL_TICKETS" }))
}));

describe("SignIn Component", () => {
  it("renders heading and button", () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );
    expect(screen.getByText("Welcome to TaskFlow Pro")).toBeInTheDocument();
    expect(screen.getByText("Your ultimate task management solution")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });

  it("dispatches loginWithGoogle when button is clicked", () => {
    const { loginWithGoogle } = require("../../store/slice/auth-slice");
    render(
      <Router>
        <SignIn />
      </Router>
    );
    fireEvent.click(screen.getByRole("button", { name: /sign in with google/i }));
    expect(loginWithGoogle).toHaveBeenCalled();
  });
});
