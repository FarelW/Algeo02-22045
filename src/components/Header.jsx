import React from "react";

const Header = () => {
    return (
      <nav className="z-[10] fixed left-0 right-0 flex flex-row justify-between items-center min-w-screen text-[20px] text-white px-8 h-24 font-aenonikregular">
        <div className="w-[20%] hover:scale-125 transition-all duration-500 cursor-pointer pl-4 justify-center flex">
          ||||| MatchLens.
        </div>
        <div className="flex flex-row gap-x-8 justify-center">
          <div className="relative">
            <a
              href="/"
              className="after:bg-white after:absolute after:h-[2.5px] after:w-0 after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300 "
            >
              Guides
            </a>
          </div>
          <div className="relative">
            <a
              href="/"
              className="after:bg-white after:absolute after:h-[2.5px] after:w-0 after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300 "
            >
              Technology
            </a>
          </div>
          <div className="relative">
            <a
              href="/"
              className="after:bg-white after:absolute after:h-[2.5px] after:w-0 after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300 "
            >
              Developers
            </a>
          </div>
        </div>
        <div className="flex justify-center w-[20%]">
          <div className="flex border-2 px-4 py-1 rounded-md bg-white text-black hover:cursor-pointer hover:bg-black hover:border-black hover:text-white transition-all duration-300">
            Launch App
          </div>
        </div>
      </nav>
    );
}

export default Header;