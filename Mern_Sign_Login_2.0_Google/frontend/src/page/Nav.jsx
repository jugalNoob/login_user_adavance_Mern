import React, { useEffect, useState } from 'react';
import { FiDatabase } from "react-icons/fi";
import { NavLink, Outlet, useNavigate, } from 'react-router-dom';
import './style/nav.css';
import { AdminId, ForId, GoogleId, NavId } from "./style/navbar/Lar";
import cookie from "js-cookie"
function Nav() {

    const Fucks = () => {

      const sidebar = document.getElementById("myname");
      sidebar.style.width = sidebar.style.width === "256px" ? "0" : "256px";

        // if (document.getElementById("myname").style.width === "256px") {
        //   document.getElementById("myname").style.width = "0";
        // } else {
        //   document.getElementById("myname").style.width = "256px";
        // }
      }

      const navigate = useNavigate();

      const [isLoggedIn, setIsLoggedIn] = useState(false);


   


      /// logout function  

      useEffect(() => {
        // Check user's authentication status on component mount
        const usersDataToken = cookie.get("usersdatatoken");
        if (usersDataToken) {
          setIsLoggedIn(true);
        }
      }, []);
    
      const handleLogout = () => {
        // Clear user data and update login state
        cookie.remove("usersdatatoken");
        sessionStorage.removeItem("hash");
    
        setIsLoggedIn(false);
        navigate("/");
      };




  return (
    <div>



<div className="background-home">
<div className="flex-home">


    <div className="head-one">
  
<h1>mern stack</h1>
    </div>
    <div className="icone">
    <span class="material-symbols-outlined" onClick={Fucks}>
    <FiDatabase />
</span>
    </div>

 
</div>

<div className="siders" id="myname">

<NavLink to="/">home</NavLink>


            {isLoggedIn ? (
              <>
            
                <center>
                <NavLink to={ NavId()}>Profile

</NavLink>

<NavLink to={ForId()}>forget</NavLink>


{/* 
<NavLink to={  GoogleId()}>googleDash</NavLink> */}

<NavLink to="/google">googleDash</NavLink>

<NavLink to= {AdminId()}>admin</NavLink>

                <button onClick={handleLogout}>logout</button>
                </center>
              </>
            ) : (
              <>
              <NavLink to="/from">form</NavLink>
              <NavLink to="/login">login</NavLink>
            
              <NavLink to="/info">googlelogin</NavLink>
              </>
            )}
    </div>

</div>




{/* /// ---- second row class line start  */}
{/* 
      <h1>Jugal's Navigation</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <br />
        <br />
        <NavLink to="/from">From</NavLink>
        <br />
        <br />
        <NavLink to="/login">Login</NavLink>
        <br />
        <br />
        <NavLink to="/dash">Dash</NavLink>
        <br />
        <br />
        <NavLink to="/forget">Forget</NavLink>
      </nav> */}

      {/* This is where the child components will be rendered */}
      <Outlet />
    </div>
  );
}

export default Nav;
