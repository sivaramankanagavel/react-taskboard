import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserManagement from "../user-management/UserManagement";
import Modal from "react-modal";

// Mock redux slice actions
jest.mock("../../store/slice/auth-slice", () => ({
  createUser: jest.fn((data) => ({ type: "CREATE_USER", payload: data })),
  deleteUser: jest.fn((id) => ({ type: "DELETE_USER", payload: id })),
  updateuser: jest.fn((args) => ({ type: "UPDATE_USER", payload: args })),
}));

// mock store without middleware
const mockStore = configureStore([]);

// set app element for react-modal
beforeAll(() => {
  Modal.setAppElement(document.createElement("div"));
});

// cleanup between tests so renders don’t overlap
afterEach(() => {
  cleanup();
});

describe("UserManagement Component", () => {
  const initialUsers = [
    { _id: "1", name: "Alice", email: "alice@example.com", role: "ADMIN" },
    { _id: "2", name: "Bob", email: "bob@example.com", role: "TASK_CREATOR" },
    { _id: "3", name: "Charlie", email: "charlie@example.com", role: "READ_ONLY_USER" },
  ];

  const renderWithStore = (storeState) => {
    const store = mockStore(storeState);
    return render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
  };

  test("renders header and search input", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  test("renders list of users", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  test("filters users when typing in search", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    fireEvent.change(screen.getByPlaceholderText("Search users..."), {
      target: { value: "bob" },
    });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  test("shows Add User button for admin", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });
    expect(screen.getByText("+ Add User")).toBeInTheDocument();
  });

  test("does NOT show Add User button for non-admin", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: false } },
    });
    expect(screen.queryByText("+ Add User")).not.toBeInTheDocument();
  });

  test("opens Create User modal when Add User clicked", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    fireEvent.click(screen.getByText("+ Add User"));
    expect(screen.getByText(/Create user/i)).toBeInTheDocument();
  });

  test("opens Edit modal when Edit clicked", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    fireEvent.click(screen.getAllByText(/Edit/i)[0]);
    expect(screen.getByText(/Edit user/i)).toBeInTheDocument();
  });

  test("opens Delete confirmation modal when Delete clicked", () => {
    renderWithStore({
      auth: { users: initialUsers, userData: { isAdmin: true } },
    });

    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
  });
});
