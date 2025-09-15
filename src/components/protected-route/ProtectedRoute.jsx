import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    if(!isLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default ProtectedRoute;