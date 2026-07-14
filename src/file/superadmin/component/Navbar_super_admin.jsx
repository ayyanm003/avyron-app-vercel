import "./style/Navbar_super_admin_style.css";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Outlet } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/only_admin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>AVYRON</h2>
      </div>

      <div
        className="navbar-profile"
        onClick={() => setOpen(!open)}
      >
        <FaUserCircle className="profile-icon" />
        <FaChevronDown className={`arrow ${open ? "rotate" : ""}`} />

        {open && (
          <div className="profile-dropdown">
            {/* <button>Profile</button>
            <button>Settings</button> */}
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;