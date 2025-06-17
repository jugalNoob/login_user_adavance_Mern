import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import './style/nav.css';

function Nav() {


  return (
    <div className="background-home">
      <div className="flex-home">
        <div className="head-one">
          <h1>Jugal's Navigation</h1>
          <nav>
            <NavLink to="/">Home</NavLink><br /><br />
            <NavLink to="/from">From</NavLink><br /><br />
            <NavLink to="/login">Login</NavLink><br /><br />
            <NavLink to="/dash">Dash</NavLink><br /><br />
            <NavLink to="/forget">Forget</NavLink><br /><br />
          
          </nav>
          {/* Renders child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Nav;
