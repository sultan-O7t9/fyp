import React from "react";

const TableNavbar = props => {
  const { children } = props;

  return (
    <div className="flex flex-wrap items-center justify-between py-2.5 px-3 mb-3 bg-transparent false undefined">
      {children}
    </div>
  );
};

export default TableNavbar;
