import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = ({ path }) => {
  return (
    <>
      <p>
        <b>Access denied.</b> You don't have permission to access this resource.
      </p>
      <Link to={path}>Back to Dashboard</Link>
    </>
  );
};

export default AccessDenied;
