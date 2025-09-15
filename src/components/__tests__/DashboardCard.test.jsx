import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardCard from "../dashboard-card/DashboardCard.jsx";
import { UserCircle } from "lucide-react";

describe("DashboardCard Component", () => {
  it("renders the title and count", () => {
    render(<DashboardCard title="Users" count={42} icon={<UserCircle />} color="blue" />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("applies the correct color class", () => {
    const { container } = render(
      <DashboardCard title="Tasks" count={10} icon={<UserCircle />} color="red" />
    );

    // Top-level div should include the dynamic class
    expect(container.firstChild).toHaveClass("dashboard__card--red");
  });

  it("renders the icon", () => {
    render(<DashboardCard title="Admins" count={5} icon={<UserCircle data-testid="icon" />} color="green" />);
    
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});