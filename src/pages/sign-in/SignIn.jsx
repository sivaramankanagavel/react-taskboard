import React from "react";
import {
  loginWithGoogle,
  loginEndPointAsyncFunc,
} from "../../store/slice/auth-slice";
import { Chrome } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../../store/slice/project-slice";
import { getAllTickets } from "../../store/slice/tasks-slice"
import { ToastContainer } from "react-toastify";

import "./styles.scss";

function SignIn() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userLoginDetail = useSelector((state) => state?.auth?.user);
  const userData = useSelector((state) => state?.auth?.userData);
  const userStatus = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (
        userData["userId"] &&
        userStatus.isPending === false &&
        userStatus.isError === false
      ) {
        navigate("/");
      } else if (userData["userId"] !== null) {
        dispatch(fetchProjects());
        dispatch(getAllTickets());
        navigate("/");
      } else if (
        userStatus.isPending === false &&
        userStatus.isError === true
      ) {
        setOpen(true);
      } else if (userData["userId"] === null && userStatus.isPending !== true) {
        dispatch(loginEndPointAsyncFunc({ idToken: userLoginDetail.idToken }));
      }
    }
  }, [isLoggedIn, userData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginWithGoogle());
  };

  return (
    <div className="sign-in">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="sign-in__heading">
        <h1>Welcome to TaskFlow Pro</h1>
        <p>Your ultimate task management solution</p>
      </div>
      <div className="sign-in__form">
        <button className="sign-in__form button" onClick={handleSubmit}>
          <Chrome /> Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;
