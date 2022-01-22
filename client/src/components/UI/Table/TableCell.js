import React from "react";

const TableCell = props => {
  const { children } = props;
  return (
    <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
      {children}
    </td>
  );
};

export default TableCell;
