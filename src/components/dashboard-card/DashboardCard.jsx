import React from "react";

import "./styles.scss";

function DashboardCard({ title, count, icon, color }) {
  return (
    <div className={`dashboard__card--${color}`} data-testid="dashboard-card">
      <div className={`dashboard__card-content`}>
        <h4>{title}</h4>
        <p>{count}</p>
      </div>
      <div className={`dashboard__card-icon`}>{icon}</div>
    </div>
  );
}

export default DashboardCard;
