import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardCard from "../../components/dashboard-card/DashboardCard";
import { CircleCheck, ListTodo, Construction, Pickaxe } from "lucide-react";

import "./styles.scss";

function Dashboard() {
  const projects = useSelector((state) => state?.projectsData?.projects) || [];
  const useDetails = useSelector((state) => state?.auth?.user) || {};
  const allTickets = useSelector((state) => state?.ticketsData?.allTickets) || [];
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    // define the data structure for cards
    setCardsData([]);
    let newData = [];
    newData.push({ title: "Total Projects", value: projects.length, color: 'blue' });
    newData.push({ title: "Completed Tickets", value: allTickets?.filter(ticket => ticket.status === "COMPLETED").length, color: 'green' });
    newData.push({ title: "Not Started Tickets", value: allTickets?.filter(ticket => ticket.status === "NOT_STARTED").length, color: 'orange' });
    newData.push({ title: "In Progress Tickets", value: allTickets?.filter(ticket => ticket.status === "IN_PROGRESS").length, color: 'yellow' });
    newData.push({ title: "Blocked Tickets", value: allTickets?.filter(ticket => ticket.status === "BLOCKED").length, color: 'red' });

    setCardsData(newData);
  }, [projects, allTickets]);

  const getIcon = (status) => {
    switch (status) {
      case "Completed Tickets":
        return <CircleCheck />;
      case "Not Started Tickets":
        return <ListTodo />;
      case "In Progress Tickets":
        return <Pickaxe />;
      case "Blocked Tickets":
        return <Construction />;
      case "Total Projects":
        return <CircleCheck />;
      case "Total Tickets":
        return <CircleCheck />;
      default:
        return "❓";
    }
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {useDetails?.displayName || "User"} 👋</h1>
      <p>Here's what's happening with your projects today.</p>
      <div className={`dashboard__cards`}>
        {
          cardsData.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              count={card.value}
              icon={getIcon(card.title)}
              color={card.color}
            />
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
