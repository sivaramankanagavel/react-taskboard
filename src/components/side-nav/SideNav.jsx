import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sideNavData } from "../../data/sideNavData";
import { logoutWithGoogle } from "../../store/slice/auth-slice";
import { useDispatch, useSelector } from "react-redux";

import "./styles.scss";

function SideNav({ open }) {
  const [activeItem, setActiveItem] = useState(null);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isAdmin =
    useSelector((state) => state?.auth?.userData?.isAdmin) || false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  const handleLogout = () => {
    dispatch(logoutWithGoogle());
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn]);

  return (
    <div
      className={`side-nav-content ${
        open ? "side-nav-content--open" : "side-nav-content--close"
      }`}
    >
      <ul className="side-nav-ul">
        {sideNavData.map((item, index) => {
          const Icon = item.icon;
          return item.path === "/users" && !isAdmin ? null : (
            <li
              key={index + 1}
              className={`side-nav-li ${
                activeItem === item.id
                  ? "side-nav-li--active"
                  : "side-nav-li--de-active"
              }`}
            >
              <Link
                to={item.path}
                className={activeItem === item.id ? "active" : ""}
                onClick={() =>
                  item.title === "Logout"
                    ? handleLogout()
                    : handleItemClick(item.id)
                }
              >
                <Icon size={20} />
                {open && item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideNav;
