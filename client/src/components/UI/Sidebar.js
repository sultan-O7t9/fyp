import { NavLink } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Icon from "@material-tailwind/react/Icon";
import H6 from "@material-tailwind/react/Heading6";
import { useState } from "react";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState("-left-64");
  return (
    <>
      <AdminNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div
        className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300`}
      >
        <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
          <a
            href="https://material-tailwind.com?ref=mtd"
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-center w-full inline-block"
          >
            <H6 color="gray">UOG</H6>
          </a>
          <div className="flex flex-col">
            <hr className="my-4 min-w-full" />

            <ul className="flex-col min-w-full flex list-none">
              <li className="rounded-lg mb-4">
                <NavLink
                  to="/dashboard"
                  exact
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="dashboard" size="2xl" />
                  Dashboard
                </NavLink>
              </li>
              <li className="rounded-lg mb-4">
                <NavLink
                  to="/dashboard/groups"
                  exact
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="group" size="2xl" />
                  Groups
                </NavLink>
              </li>
              <li className="rounded-lg mb-4">
                <NavLink
                  to="/dashboard/students"
                  exact
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="person" size="2xl" />
                  Students
                </NavLink>
              </li>
            </ul>

            <ul className="flex-col min-w-full flex list-none absolute bottom-0">
              {/* <li className="bg-gradient-to-tr from-purple-500 to-purple-700 px-4 rounded-lg text-white">
                <a
                  href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-4 text-sm font-light py-3"
                >
                  Free Download
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
