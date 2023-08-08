import React from 'react'
import {
    Link, useLocation, useNavigate
  } from "react-router-dom";

function Navbar() {
    let location = useLocation();

    let navigate = useNavigate();

    const handleLogout = ()=>{
      fetch(`/logout`, {
        method: "GET",
      });
      localStorage.removeItem('username');
      navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light border-bottom border-3 pb-2">
      <div className="container">
        <Link className="navbar-brand fw-bold text-secondary" to="/">StockEarn</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {localStorage.getItem('username')?
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fs-5">
                <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/quote" || location.pathname === "/quoted"?"fw-semibold link-underline-dark":""}`} aria-current="page" to="/quote">Quote</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/buy"?"fw-semibold":""}`} aria-current="page" to="/buy">Buy</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/sell"?"fw-semibold":""}`} aria-current="page" to="/sell">Sell</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/history"?"fw-semibold":""}`} aria-current="page" to="/history">History</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/leaderboard"?"fw-semibold":""}`} aria-current="page" to="/leaderboard">Leaderboard</Link>
                </li>

            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                <button className="material-icons md-24 nav-link fw-semibold" onClick={handleLogout}>logout</button>
                </li>
            </ul>
          </div>:

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <Link className="nav-link fw-semibold" aria-current="page" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link fw-semibold" aria-current="page" to="/login">Login</Link>
                </li>
            </ul>
          </div>

          }
      </div>
    </nav>
  )
}

export default Navbar