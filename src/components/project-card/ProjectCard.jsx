import React, { useState } from "react";
import { CircleUser, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject, updateproject } from "../../store/slice/project-slice";
import { Button } from "@mui/material";
import Modal from "react-modal";
import { Edit, Trash } from "lucide-react";

import "./styles.scss";
import { toast } from "react-toastify";

function ProjectCard({ title, description, owner, createdAt, id }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state?.auth?.userData?.isAdmin);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    assigneeId: "",
    members: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [focusedProject, setFocusedProject] = useState(null);
  const users = useSelector((state) => state?.auth?.users) || [];
  const projects = useSelector((state) => state?.projectsData?.projects) || [];
  const [members, setMembers] = useState("");

  // Format the date
  const dateObj = new Date(createdAt);
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const handleDeleteProject = () => {
    dispatch(deleteProject({ id }));
  };

  const handleOpenModal = (id) => {
    const foundproject = projects.find((project) => project._id === id);
    if (foundproject) {
      const members = [];
      foundproject.members?.forEach((member) => {
        const user = users.filter((user) => user._id === member._id);
        members.push(user[0]?.name);
      });
      setMembers(members.join(", "));
      setProjectFormData({
        name: foundproject.name,
        description: foundproject.description,
        startDate: foundproject.startDate,
        endDate: foundproject.endDate,
        assigneeId: foundproject.ownerId?.name || "N/A",
        members: members.join(", ") || "N/A",
      });
    }
    setFocusedProject(foundproject);
    setOpenModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateProject(focusedProject._id);
    setIsEditing(false);
    setOpenModal(false);
  };

  const handleUpdateProject = (projectId) => {
    dispatch(updateproject({ id: projectId, projectData: projectFormData }));
    toast.success("Project updated successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <>
      <div className="project-card">
        <div className="project-card__header">
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
        <p>
          <CircleUser /> {owner}
        </p>
        <p>
          <Calendar /> {formattedDate}
        </p>
        <Button variant="contained" onClick={() => handleOpenModal(id)}>
          View Details
        </Button>
      </div>
      <Modal isOpen={openModal} className="projects-page__modal">
        {isEditing ? (
          <form
            className="projects-page__modal__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label>
              Project Name*
              <input
                type="text"
                value={projectFormData.name}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    name: e.target.value,
                  })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Description*
              <textarea
                value={projectFormData.description}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
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
                value={projectFormData.startDate}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
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
                value={projectFormData.dueDate}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    dueDate: e.target.value,
                  })
                }
                disabled={!isAdmin}
              />
            </label>
            <label>
              Owner Name*
              <select
                value={projectFormData.ownerId}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    ownerId: e.target.value,
                  })
                }
                disabled={!isAdmin}
              >
                <option value="">Select Owner</option>
                {users.filter((user) => user.role === "ADMIN" || user.role === "TASK_CREATOR").map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Members Name*
              <select
                multiple
                value={projectFormData.members}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    members: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
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
            <h2>{focusedProject?.name}</h2>
            <p>
              <strong>Description:</strong> {focusedProject?.description}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {focusedProject?.startDate
                ? new Date(focusedProject?.startDate).toLocaleDateString(
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
              <strong>End Date:</strong>{" "}
              {focusedProject?.endDate
                ? new Date(focusedProject?.endDate).toLocaleDateString(
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
              <strong>Owner:</strong>{" "}
              {users.find((user) => user._id === focusedProject?.ownerId?._id)
                ?.name || "N/A"}
            </p>
            <p>
              <strong>Members:</strong>{" "} {members || "N/A"}
            </p>
            <div className="modal-buttons">
              {isAdmin && (
                <Button
                  onClick={() => setIsEditing(true)}
                  disabled={!isAdmin}
                  variant="contained"
                >
                  <Edit size={16} />
                </Button>
              )}
              {isAdmin && (
                <Button
                  onClick={() => handleDeleteProject(focusedProject._id)}
                  variant="contained"
                  aria-label="delete project"
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
    </>
  );
}

export default ProjectCard;
