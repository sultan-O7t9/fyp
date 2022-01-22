import React from "react";

const TableHead = props => {
  const { children } = props;
  return (
    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
      {children}
    </th>
  );
};

export default TableHead;
