import React from "react";
import { useSelector } from "react-redux";

import "./styles.scss";

function BadgeCard() {
    const isAdmin = useSelector((state) => state?.auth?.userData?.isAdmin) || false;
    const isReadOnly = useSelector((state) => state?.auth?.userData?.isReadOnly) || false;
    const isTaskCreator = useSelector((state) => state?.auth?.userData?.isTaskCreator) || false;

    return (
        <span className="badge">{isAdmin ? "Admin" : isReadOnly ? "Read Only" : "Task Creator"}</span>
    )
}

export default BadgeCard;