import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import BadgeCard from "../badge-card/BadgeCard.jsx";

const mockStore = configureStore([]);

describe("BadgeCard Component", () => {
  it("renders Admin badge when user is admin", () => {
    const store = mockStore({
      auth: { userData: { isAdmin: true } },
    });

    render(
      <Provider store={store}>
        <BadgeCard />
      </Provider>
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders Read Only badge when user is read only", () => {
    const store = mockStore({
      auth: { userData: { isReadOnly: true } },
    });

    render(
      <Provider store={store}>
        <BadgeCard />
      </Provider>
    );

    expect(screen.getByText("Read Only")).toBeInTheDocument();
  });

  it("renders Task Creator badge when user is task creator", () => {
    const store = mockStore({
      auth: { userData: { isTaskCreator: true } },
    });

    render(
      <Provider store={store}>
        <BadgeCard />
      </Provider>
    );

    expect(screen.getByText("Task Creator")).toBeInTheDocument();
  });

  it("defaults to Task Creator when no flags are set", () => {
    const store = mockStore({
      auth: { userData: {} },
    });

    render(
      <Provider store={store}>
        <BadgeCard />
      </Provider>
    );

    expect(screen.getByText("Task Creator")).toBeInTheDocument();
  });
});
