import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsFillRocketTakeoffFill } from "react-icons/bs";

const Header = () => {
  const currentLocation = useLocation();
  const doNotShowLaunchButton =
    currentLocation.pathname === "/application"
  const navigate = useNavigate();

  const isActive = (path) => currentLocation.pathname === path;

    return (
      <nav className="z-[10] fixed left-0 right-0 flex flex-row justify-between items-center min-w-screen text-[20px] text-white px-8 h-24 font-aenonikregular">
        <div className="w-[20%] hover:scale-125 transition-all duration-500 cursor-pointer pl-4 justify-center flex">
          <Link to="/">||||| MatchLens.</Link>
        </div>
        <div className="flex flex-row gap-x-8 justify-center">
          <div className="relative">
            <Link
              to="/guides"
              className={`after:bg-white after:absolute after:h-[2.5px] ${isActive('/guides') ? 'after:w-full' : 'after:w-0'} after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300`}
            >
              Guides  
            </Link>
          </div>
          <div className="relative">
            <Link
              to="/technology"
              className={`after:bg-white after:absolute after:h-[2.5px] ${isActive('/technology') ? 'after:w-full' : 'after:w-0'} after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300`}
            >
              Technology
            </Link>
          </div>
          <div className="relative">
            <Link
              to="/developers"
              className={`after:bg-white after:absolute after:h-[2.5px] ${isActive('/developers') ? 'after:w-full' : 'after:w-0'} after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300`}
            >
              Developers
            </Link>
          </div>
        </div>
        <div className="flex justify-center w-[20%]">
          {doNotShowLaunchButton ? (
            ""
          ) : (
            <button
              onClick={() => navigate("/application")}
              className="flex items-center gap-x-3 border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-black hover:border-black hover:text-white transition-all duration-300"
            >
              <BsFillRocketTakeoffFill className="hover:text-white"></BsFillRocketTakeoffFill>
              Launch App
            </button>
          )}
        </div>
      </nav>
    );
}

export default Header;