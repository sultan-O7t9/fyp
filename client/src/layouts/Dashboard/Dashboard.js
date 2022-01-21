import React from "react";
import Sidebar from "../../components/UI/Sidebar";
// import Footer from "../../components/UI/Footer";

const Dashboard = props => {
  const { children } = props;

  return (
    <>
      <Sidebar />
      <div className="md:ml-64">
        {children}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Dashboard;
