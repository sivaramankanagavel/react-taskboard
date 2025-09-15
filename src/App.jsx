import { useState } from "react";
import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/projects/Project";
import Tickets from "./pages/tickets/Tickets"
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import SignIn from "./pages/sign-in/SignIn"
import UserManagement from "./pages/user-management/UserManagement";

import "./app.scss";

function App() {
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
