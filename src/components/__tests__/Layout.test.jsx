import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Layout from "../layout/Layout.jsx";

const mockStore = configureStore([]);
const store = mockStore({
  auth: { user: { name: "Test User" } },
});

jest.mock("../side-nav/SideNav", () => () => <div data-testid="mock-sidenav" />);
jest.mock("../badge-card/BadgeCard", () => () => <div data-testid="mock-badgecard" />);
jest.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="mock-outlet" />,
}));

describe("Layout component", () => {
  it("renders Layout with mocked children", () => {
    render(
      <Provider store={store}>
        <Layout />
      </Provider>
    );

    expect(screen.getByTestId("mock-sidenav")).toBeInTheDocument();
    expect(screen.getByTestId("mock-badgecard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
  });

  it("toggles sidebar open state", () => {
    render(
      <Provider store={store}>
        <Layout />
      </Provider>
    );

    const menuToggle = screen.getByTestId("menu-toggle");
    fireEvent.click(menuToggle);
  });
});
