import React from "react";
import { CircleUser, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTicket } from "../../store/slice/tasks-slice";

import "./styles.scss";

function TaskCard({ title, description, assignee, createdAt, ticketId }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state?.auth?.userData?.isAdmin);

  // Format the date
  const dateObj = new Date(createdAt);
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const handleDelete = () => {
    dispatch(deleteTicket({ ticketId: ticketId }));
  };

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h2>{title}</h2>
        {isAdmin && <button className="btn" onClick={() => handleDelete()}>Delete</button>}
      </div>
      <p>{description}</p>
      <p>
        <CircleUser /> {assignee}
      </p>
      <p>
        <Calendar /> {formattedDate}
      </p>
    </div>
  );
}

export default TaskCard;
