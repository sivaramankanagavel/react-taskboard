import React from "react";
import { Button } from "@mui/material";
import {
  Pencil,
  Search,
  Trash,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createUser, deleteUser, updateuser } from "../../store/slice/auth-slice";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";

import "./styles.scss";

function UserManagement() {
  const allUsers = useSelector((state) => state?.auth?.users) || [];
  const [searchitem, setSearchitem] = useState("");
  const [focusedUser, setFocusedUser] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const roles = [
    { name: "Admin", value: "ADMIN" },
    { name: "Task Creator", value: "TASK_CREATOR" },
    { name: "Read Only", value: "READ_ONLY_USER" }
  ];

  const priority = ["ADMIN", "TASK_CREATOR", "READ_ONLY_USER"];
  const dispatch = useDispatch();
  const isAdmin =
    useSelector((state) => state?.auth?.userData?.isAdmin) || false;
  const userData = useSelector((state) => state?.auth?.userData) || {};

  const handleSearchInput = (e) => {
    setSearchitem(e.target.value);
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchitem.toLowerCase())
  );

  const handleDeleteUserModal = (userId) => {
    setOpenConfirmationModal(true);
    const focusedUserFilter = allUsers.find((user) => user._id === userId);
    setFocusedUser(focusedUserFilter);
  };

  const handleEditUser = (userId) => {
    const userEditData = allUsers.find((user) => user._id === userId);
    setOpenEditModal(true);
    setUserFormData({
      name: userEditData.name,
      email: userEditData.email,
      role: userEditData.role,
    });
    setFocusedUser(userEditData);
  };

  const handleCreateSubmit = () => {
    dispatch(createUser(userFormData));
    setOpenCreateModal(false);
    setUserFormData({
      name: "",
      email: "",
      role: "",
    });
  };

  const handleCreateUser = () => {
    setOpenCreateModal(true);
  };

  const handleDeleteUser = () => {
    dispatch(deleteUser(focusedUser?._id));
    setOpenConfirmationModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateuser({ userId: focusedUser?._id, userData: userFormData, loggedUserData: userData }));
    setOpenEditModal(false);
  }

  return (
    <div className="user-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <Modal
        isOpen={openConfirmationModal}
        onRequestClose={() => setOpenConfirmationModal(false)}
        className="projects-page__modal"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="modal-buttons">
          <Button onClick={() => handleDeleteUser()} variant="contained">
            Yes
          </Button>
          <Button
            onClick={() => setOpenConfirmationModal(false)}
            variant="contained"
            color="secondary"
          >
            No
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={openEditModal}
        onRequestClose={() => setOpenEditModal(false)}
        className="projects-page__modal"
      >
        <h2>
          <UserPlus /> Edit user
        </h2>
        <form
          className="projects-page__modal__form"
          onSubmit={(e) => handleEditSubmit(e)}
        >
          <label>
            User Name*
            <input
              type="text"
              value={userFormData.name}
              onChange={(e) =>
                setUserFormData({ ...userFormData, name: e.target.value })
              }
            />
          </label>
          <label>
            Email*
            <input
              type="email"
              value={userFormData.email}
              onChange={(e) =>
                setUserFormData({ ...userFormData, email: e.target.value })
              }
            />
          </label>
          <label>
            Role*
            <select
              value={userFormData.role}
              onChange={(e) =>
                setUserFormData({ ...userFormData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              {roles.filter((user, index) => index < priority.indexOf(userFormData.role)).map((role) => (
                <option key={role.value} value={role.value}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <div className="projects-page__modal__buttons">
            <button type="submit" className="btn">
              Update
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={openCreateModal}
        onRequestClose={() => setOpenCreateModal(false)}
        className="projects-page__modal"
      >
        <h2>
          <UserPlus /> Create user
        </h2>
        <form
          className="projects-page__modal__form"
          onSubmit={(e) => handleCreateSubmit(e)}
        >
          <label>
            User Name*
            <input
              type="text"
              value={userFormData.name}
              onChange={(e) =>
                setUserFormData({ ...userFormData, name: e.target.value })
              }
            />
          </label>
          <label>
            Email*
            <input
              type="email"
              value={userFormData.email}
              onChange={(e) =>
                setUserFormData({ ...userFormData, email: e.target.value })
              }
            />
          </label>
          <label>
            Role*
            <select
              value={userFormData.role}
              onChange={(e) =>
                setUserFormData({ ...userFormData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <div className="projects-page__modal__buttons">
            <button type="submit" className="btn">
              Create
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setOpenCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <div className="user-page__header">
        <div className="user-page__header content">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCreateUser()}
          >
            + Add User
          </Button>
        )}
      </div>
      <div className="user-page__search">
        <Search />
        <input
          type="text"
          placeholder="Search users..."
          onChange={handleSearchInput}
        />
      </div>
      <div className="user-page__user-card">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="card">
              <div
                className={`card__header ${
                  user.role === "ADMIN"
                    ? "admin"
                    : user.role === "READ_ONLY_USER"
                    ? "read-only-user"
                    : "task-creator"
                }`}
              >
                <div className="card__content">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <div
                className={`card__role ${
                  user.role === "ADMIN"
                    ? "admin"
                    : user.role === "READ_ONLY_USER"
                    ? "read-only-user"
                    : "task-creator"
                }`}
              >
                {user.role === "ADMIN" ? (
                  <UserCheck />
                ) : user.role === "READ_ONLY_USER" ? (
                  <UserX />
                ) : (
                  <Pencil />
                )}{" "}
                <span
                  className={`role-badge ${
                    user.role === "ADMIN"
                      ? "admin"
                      : user.role === "READ_ONLY_USER"
                      ? "read-only-user"
                      : "task-creator"
                  }`}
                >
                  {user.role === "ADMIN"
                    ? "Admin"
                    : user.role === "READ_ONLY_USER"
                    ? "Read Only"
                    : "Task creator"}
                </span>
              </div>
              <div className="card__actions">
                {isAdmin && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditUser(user._id)}
                  >
                    <Pencil size={16} /> Edit
                  </Button>
                )}
                {user.role !== "ADMIN" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteUserModal(user._id)}
                  >
                    <Trash size={16} /> Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
