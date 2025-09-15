import React, { useState } from "react";
import { Menu, CircleX, UserPen, Badge } from "lucide-react";
import { Outlet } from "react-router-dom";
import SideNav from "../side-nav/SideNav";
import { useSelector } from "react-redux";
import BadgeCard from "../badge-card/BadgeCard";

import "./styles.scss";

function Layout() {
  const [open, setOpen] = useState(false);
  const userData = useSelector((state) => state?.auth?.user);

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
            <span>{userData?.displayName}</span>
            <span>{userData?.email}</span>
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
