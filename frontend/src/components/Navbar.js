import React from "react";
import { Link } from "react-router-dom";
import '../styles/styling.css';
const Navbar = () => (
  <nav className="navbar">
    <div className="d-flex flex-column align-items-center logo-and-name">
      <img
        src="data:image/png;base64,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"
        className="image"
        alt="logo"
      />
      {/* <p className="para">Invoice</p> */}
    </div>
    <ul className="navbar-links">
      <li>
        <Link to="/home">Home</Link>
      </li>
      <li>
        <Link to="/">Login</Link>
      </li>
      <li>
        <Link to="/signup">Sign up</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
