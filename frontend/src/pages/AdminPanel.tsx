import React from "react";
import { Link } from "react-router-dom";

const AdminPanel: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/admin/crud">Manage Admins</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminPanel;
