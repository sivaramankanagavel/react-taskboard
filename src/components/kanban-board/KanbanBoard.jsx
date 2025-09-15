import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, Card, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTicketStatus,
  getAllTickets,
  deleteTicket
} from "../../store/slice/tasks-slice";
import CircularProgress from "@mui/material/CircularProgress";
import { Calendar, Folder, CircleUser, Edit, Trash } from "lucide-react";
import Modal from "react-modal";
import { toast } from "react-toastify";

import "./styles.scss";

const KanbanBoard = ({ selectedProject }) => {
  const tickets = useSelector((state) => state?.ticketsData?.allTickets) || [];
  const userData = useSelector((state) => state?.auth?.userData);
  const isPending = useSelector((state) => state?.ticketsData?.isPending);
  const [taskFormData, setTaskFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    assigneeId: "",
    projectId: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const isAdmin =
    useSelector((state) => state?.auth?.userData?.isAdmin) || false;
  const isTaskCreator = useSelector((state) => state?.auth?.userData?.isTaskCreator) || false;
  const users = useSelector((state) => state?.auth?.users) || [];
  const projects = useSelector((state) => state?.projectsData?.projects) || [];
  const [focusedTicket, setFocusedTicket] = useState(null);
  const dispatch = useDispatch();

  const filteredTickets =
    selectedProject === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.projectId?._id === selectedProject);

  const statuses = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"];
  const statusLabels = {
    NOT_STARTED: "To Do",
    IN_PROGRESS: "In Progress",
    BLOCKED: "Blocked",
    COMPLETED: "Completed",
  };

  const onDragEnd = (result) => {
    const { destination, draggableId, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const task = tickets.find((t) => t._id === draggableId);
    if (!task) return;

    dispatch(
      updateTicketStatus({
        ticketId: draggableId,
        updatedData: {
          status: destination.droppableId,
          description: task.description,
          dueDate: task.dueDate,
        },
      })
    ).then(() => {
      dispatch(getAllTickets({ userId: userData.userId }));
    });
  };

  const handleTaskUpdate = (taskId) => {
    setTaskId(taskId);
    const foundTicketData = tickets.find((t) => t._id === taskId);
    if (!foundTicketData) return;

    setFocusedTicket(foundTicketData);
    setTaskFormData({
      name: foundTicketData?.name || "",
      description: foundTicketData?.description || "",
      startDate: foundTicketData?.createdAt || "",
      dueDate: foundTicketData?.dueDate || "",
      assigneeId: foundTicketData?.assigneeId?._id || "",
      projectId: foundTicketData?.projectId?._id || "",
    });
    setOpenModal(true);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, startDate, dueDate, assigneeId } = taskFormData;

    if (!name || !description || !startDate || !dueDate || !assigneeId) {
      toast.error("Please fill in all required fields!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    dispatch(
      updateTicketStatus({ ticketId: taskId, updatedData: taskFormData })
    );
    toast.success("Ticket updated successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setOpenModal(false);
    setIsEditing(false);
    setTaskFormData({
      name: "",
      description: "",
      startDate: "",
      dueDate: "",
      assigneeId: "",
    });
    setTaskId(null);
  };

  const handleTaskDelete = (taskId) => {
    if (!taskId) return;
    dispatch(deleteTicket({ ticketId: taskId }));
    toast.success("Ticket deleted successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setOpenModal(false);
    setIsEditing(false);
    setTaskFormData({
      name: "",
      description: "",
      startDate: "",
      dueDate: "",
      assigneeId: "",
    });
  };

  return (
    <Box position="relative" width="100%" height="100%">
      {isPending && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255,255,255,0.6)"
        >
          <CircularProgress />
        </Box>
      )}
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className="projects-page__modal"
      >
        {isEditing ? (
          <form
            className="projects-page__modal__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label>
              Ticket Name*
              <input
                type="text"
                value={taskFormData.name}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, name: e.target.value })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Description*
              <textarea
                value={taskFormData.description}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    description: e.target.value,
                  })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Start Date*
              <input
                type="date"
                value={taskFormData.startDate}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    startDate: e.target.value,
                  })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Due Date*
              <input
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    dueDate: e.target.value,
                  })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Assignee ID*
              <select
                value={taskFormData.assigneeId}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    assigneeId: e.target.value,
                  })
                }
                disabled={!isAdmin}
              >
                <option value="">Select Assignee</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Project ID*
              <select
                value={taskFormData.projectId}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    projectId: e.target.value,
                  })
                }
                disabled={!isAdmin}
              >
                <option value="">Select Project ID</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="projects-page__modal__buttons">
              <button type="submit" className="btn" disabled={!isAdmin}>
                Update
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-view">
            <h2>{focusedTicket?.name}</h2>
            <p>
              <strong>Description:</strong> {focusedTicket?.description}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {focusedTicket?.createdAt
                ? new Date(focusedTicket?.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
                : "N/A"}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {focusedTicket?.dueDate
                ? new Date(focusedTicket?.dueDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                : "N/A"}
            </p>
            <p>
              <strong>Assignee:</strong>{" "}
              {users.find((user) => user._id === focusedTicket?.assigneeId?._id)
                ?.name || "N/A"}
            </p>
            <p>
              <strong>Project:</strong>{" "}
              {projects.find(
                (project) => project._id === focusedTicket?.projectId?._id
              )?.name || "Project Removed"}
            </p>
            <div className="modal-buttons">
              {(isAdmin || isTaskCreator) && (
                <Button
                  onClick={() => setIsEditing(true)}
                  disabled={!isAdmin}
                  variant="contained"
                >
                  <Edit size={16} />
                </Button>)}
              {isAdmin && (
                <Button
                  onClick={() => handleTaskDelete(focusedTicket._id)}
                  variant="contained"
                >
                  <Trash size={16} />
                </Button>
              )}
              <Button onClick={() => setOpenModal(false)} variant="contained">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <DragDropContext onDragEnd={onDragEnd} className="p-0">
        <Box className="kanban-board-container d-flex flex-row w-100 h-100 p-0 gap-3">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    p: 2,
                  }}
                  className={`kanban-column ${status}-column`}
                >
                  <Typography variant="h6" gutterBottom>
                    {statusLabels[status] || status}
                  </Typography>
                  {filteredTickets
                    ?.filter((ticket) => ticket.status === status)
                    ?.map((ticket, index) => (
                      <Draggable
                        key={ticket._id}
                        draggableId={String(ticket._id)}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2, cursor: "grab" }}
                            className={`kanban-card kanban-card-status ${ticket.status.toLowerCase()}`}
                          >
                            <div className="card-header">
                              <span className="ticket-name">{ticket.name}</span>
                              <span className="status-badge">
                                {ticket.status}
                              </span>
                            </div>
                            {ticket.projectId?.name && (
                              <p className="due-date">
                                <Folder /> {ticket.projectId?.name}
                              </p>
                            )}
                            <span className="due-date">
                              <CircleUser /> {ticket.assigneeId?.name}
                            </span>
                            {ticket.dueDate && (
                              <div className="due-date">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>
                                  Due{" "}
                                  {new Date(ticket.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            )}
                            <Button
                              variant="contained"
                              size="sm"
                              className="w-full"
                              onClick={() => handleTaskUpdate(ticket._id)}
                            >
                              View Details
                            </Button>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
