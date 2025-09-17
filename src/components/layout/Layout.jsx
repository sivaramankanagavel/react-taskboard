import React, { useState, useEffect } from "react";
import { Menu, CircleX, UserPen, Badge } from "lucide-react";
import { Outlet } from "react-router-dom";
import SideNav from "../side-nav/SideNav";
import { useSelector } from "react-redux";
import BadgeCard from "../badge-card/BadgeCard";

import "./styles.scss";

function Layout() {
  const [open, setOpen] = useState(false);
  const userData = useSelector((state) => state?.auth?.user);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userData"));
    setUserDetails(userDetails);
  }, [userData])

  return (
    <div className="layout">
      <div className={`layout__sidenav-bar${open ? "--open" : "--close"}`}>
        <div className={`layout__icon-toggle${open ? "--open" : "--close"}`} data-testid="menu-toggle">
          {!open ? (
            <Menu size={24} className="icon" onClick={() => setOpen(true)} />
          ) : (
            <CircleX
              size={24}
              className="icon"
              onClick={() => setOpen(false)}
            />
          )}
        </div>
        <SideNav open={open} />
      </div>

      <div className={`layout__top-nav ${open ? "open" : "close"}`}>
        <div className="layout__user-profile">
          <BadgeCard />
          <div className="layout__user-profile--info">
            {userDetails.name && <span>{userDetails.name}</span>}
            {userDetails.email && <span>{userDetails.email}</span>}
          </div>
          <UserPen />
        </div>
      </div>

      <div className={`layout__content ${open ? "open" : "close"}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
