import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Layout from "../layout/Layout.jsx";

// Mock child components
jest.mock("../side-nav/SideNav", () => () => <div data-testid="mock-sidenav" />);
jest.mock("../badge-card/BadgeCard", () => () => <div data-testid="mock-badgecard" />);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div data-testid="mock-outlet" />,
}));

// A minimal reducer is still needed because the component uses useSelector
const authReducer = (state = { user: {}, userData: {} }) => state;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

describe("Layout component", () => {
  const mockUserDetails = {
    name: "Test User",
    email: "test@example.com",
  };

  // Use beforeEach to set up the sessionStorage mock before each test
  beforeEach(() => {
    sessionStorage.setItem("userData", JSON.stringify(mockUserDetails));
  });

  // Use afterEach to clean up the mock, ensuring tests are isolated
  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders all child components and user details from sessionStorage", () => {
    render(
      <Provider store={store}>
        <Layout />
      </Provider>
    );

    expect(screen.getByTestId("mock-sidenav")).toBeInTheDocument();
    expect(screen.getByTestId("mock-badgecard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();

    // Assert that user details are rendered from the mocked sessionStorage
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("toggles sidebar open and close on icon click", () => {
    render(
      <Provider store={store}>
        <Layout />
      </Provider>
    );

    const sideNavContainer = screen.getByTestId("mock-sidenav").parentElement;
    
    expect(sideNavContainer).toHaveClass("layout__sidenav-bar--close");
    const openButton = screen.getByTestId("menu-toggle").querySelector('.lucide-menu');
    fireEvent.click(openButton);

    expect(sideNavContainer).toHaveClass("layout__sidenav-bar--open");
    const closeButton = screen.getByTestId("menu-toggle").querySelector('.lucide-circle-x');
    fireEvent.click(closeButton);

    expect(sideNavContainer).toHaveClass("layout__sidenav-bar--close");
  });
});