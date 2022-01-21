import React from "react";
import StatusCard from "../../components/UI/StatusCard";
import TableCard from "../../components/UI/TableCard";
import Dashboard from "../../layouts/Dashboard/Dashboard";

const AllGroups = () => {
  return (
    <Dashboard>
      <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto"></div>

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <TableCard />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AllGroups;
