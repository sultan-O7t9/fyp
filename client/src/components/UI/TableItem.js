import { Progress } from "@material-tailwind/react";
import React from "react";

const TableItem = props => {
  const { id, members, title, supervisor } = props;

  return (
    <tr>
      <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
        {id}
      </th>
      <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
        <ul>
          {members.map(member => (
            <li>{member}</li>
          ))}
        </ul>
      </th>
      <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
        {title}
      </th>
      <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
        {supervisor}
      </th>
    </tr>
  );
};

export default TableItem;
