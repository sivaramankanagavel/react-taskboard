import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FolderKanban, Search, FilePlus2 } from "lucide-react";
import ProjectCard from "../../components/project-card/ProjectCard";
import { addProject } from "../../store/slice/project-slice";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.scss";

function Projects() {
  const projects = useSelector((state) => state?.projectsData?.projects) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    assigneeId: "",
    members: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const users = useSelector((state) => state?.auth?.users) || [];
  const isAdmin =
    useSelector((state) => state?.auth?.userData?.isAdmin) || false;
  const dispatch = useDispatch();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm)
  );

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, startDate, endDate, assigneeId, members } =
      projectFormData;

    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !assigneeId ||
      !members.length === 0
    ) {
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

    dispatch(addProject({ projectData: projectFormData }));
    setOpenModal(false);
    setProjectFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      assigneeId: "",
      members: [],
    });
    toast.success("Project added successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="projects-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className="projects-page__modal"
      >
        <h2>
          <FilePlus2 /> Add New Project
        </h2>
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
                setProjectFormData({ ...projectFormData, name: e.target.value })
              }
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
            />
          </label>
          <label>
            End Date*
            <input
              type="date"
              value={projectFormData.endDate}
              onChange={(e) =>
                setProjectFormData({
                  ...projectFormData,
                  endDate: e.target.value,
                })
              }
            />
          </label>
          <label>
            Assignee ID*
            <select
              value={projectFormData.assigneeId}
              onChange={(e) =>
                setProjectFormData({
                  ...projectFormData,
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
            Members ID*
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
      <div className="projects-page__header">
        <h1>
          <FolderKanban size={36} /> Projects
        </h1>
        {isAdmin && (
          <button className="btn" onClick={() => setOpenModal(true)}>
            + Add Project
          </button>
        )}
      </div>

      <div className="projects-page__search">
        <Search />
        <input
          type="text"
          placeholder="Search projects..."
          onChange={handleSearchInput}
        />
      </div>
      <div className="projects-page__project-card">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              owner={project.ownerId.name}
              createdAt={project.ownerId.createdAt}
              id={project.id}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
