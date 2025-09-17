import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Project";
import Tickets from "./pages/tickets/Tickets"
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import SignIn from "./pages/sign-in/SignIn"
import UserManagement from "./pages/user-management/UserManagement";
import { useDispatch } from "react-redux";
import { getAllUsers, setInitialAuthData } from "./store/slice/auth-slice";

import "./app.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const expirationTime = sessionStorage.getItem("tokenExpiration");
    const userDataString = sessionStorage.getItem("userData");

    const isSessionValid = token && expirationTime && new Date().getTime() < parseInt(expirationTime);

    if (isSessionValid) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData) {
          dispatch(setInitialAuthData({
            isLoggedIn: true,
            userData: {
              isReadOnly: userData.role === "READ_ONLY_USER",
              isAdmin: userData.role === "ADMIN",
              isTaskCreator: userData.role === "TASK_CREATOR",
              userId: userData._id,
            },
            user: userData,
          }));
          dispatch(getAllUsers())
        }
      } catch (error) {
        console.error("Failed to parse session data. Clearing storage.", error);
        sessionStorage.clear();
      }
    } else {
      sessionStorage.clear();
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
