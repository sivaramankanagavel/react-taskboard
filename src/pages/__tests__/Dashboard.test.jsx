import React from "react";
import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Dashboard from "../dashboard/Dashboard";

const projectsReducer = (state = { projects: [] }) => state;
const ticketsReducer = (state = { allTickets: [] }) => state;
const authReducer = (state = { user: {} }) => state;

describe("Dashboard", () => {
  const mockProjects = [{ id: 1 }, { id: 2 }];
  const mockTickets = [
    { id: 1, status: "COMPLETED" },
    { id: 2, status: "IN_PROGRESS" },
    { id: 3, status: "BLOCKED" },
    { id: 4, status: "NOT_STARTED" },
    { id: 5, status: "COMPLETED" },
  ];
  const mockUser = { displayName: "Admin User" };

  const store = configureStore({
    reducer: {
      projectsData: projectsReducer,
      ticketsData: ticketsReducer,
      auth: authReducer,
    },
    preloadedState: {
      projectsData: { projects: mockProjects },
      ticketsData: { allTickets: mockTickets },
      auth: { user: mockUser },
    },
  });

  it("renders welcome message with user name", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const heading = screen.getByRole('heading', { name: /Welcome back, User/i });
    expect(heading).toBeInTheDocument();
    
    expect(screen.getByText(/Here's what's happening with your projects today/i)).toBeInTheDocument();
  });

  it("renders all cards with correct titles and counts", async () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const expectedData = [
      { title: "Total Projects", count: 2 },
      { title: "Completed Tickets", count: 2 },
      { title: "Not Started Tickets", count: 1 },
      { title: "In Progress Tickets", count: 1 },
      { title: "Blocked Tickets", count: 1 },
    ];

    for (const data of expectedData) {
      const cardHeading = await screen.findByRole("heading", { name: data.title });
      expect(cardHeading).toBeInTheDocument();

      const cardContainer = cardHeading.closest("[data-testid='dashboard-card']");
      const count = within(cardContainer).getByText(data.count.toString());
      expect(count).toBeInTheDocument();
    }
  });
});