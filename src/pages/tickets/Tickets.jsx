import React from "react";
import { Ticket } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { addTicket } from "../../store/slice/tasks-slice";
import KanbanBoard from "../../components/kanban-board/KanbanBoard";

import "./styles.scss";
import "react-toastify/dist/ReactToastify.css";

function Tickets() {
  const [openModal, setOpenModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    assigneeId: "",
  });
  const [selectedProject, setSelectedProject] = useState("all");
  const isAdmin =
    useSelector((state) => state?.auth?.userData?.isAdmin) || false;
  const isTaskCreator = useSelector((state) => state?.auth?.userData?.isTaskCreator) || false;
  const users = useSelector((state) => state?.auth?.users) || [];
  const projects = useSelector((state) => state?.projectsData?.projects) || [];
  const dispatch = useDispatch();

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

    dispatch(addTicket({ ticketData: taskFormData }));
    setOpenModal(false);
    setTaskFormData({
      name: "",
      description: "",
      startDate: "",
      dueDate: "",
      assigneeId: "",
    });
    toast.success("Ticket added successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="tickets-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className="projects-page__modal"
      >
        <h2>
          <Ticket /> Add New Ticket
        </h2>
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
            <button type="submit" className="btn">
              Submit
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <div className="tickets-page__header">
        <h1>
          <Ticket size={36} /> Tasks
        </h1>
        {(isAdmin || isTaskCreator) && (
          <button className="btn" onClick={() => setOpenModal(true)}>
            + Add Task
          </button>
        )}
      </div>
      <div className="tickets-page__search">
        <label htmlFor="project-filter">Filter by Project:</label>
        <select
          id="project-filter"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Project Tickets</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <KanbanBoard selectedProject={selectedProject} />
      </div>
    </div>
  );
}

export default Tickets;
