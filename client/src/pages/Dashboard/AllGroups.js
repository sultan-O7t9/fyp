import React from "react";
import { useSelector } from "react-redux";
import Table from "../../components/UI/Table";
import TableCell from "../../components/UI/Table/TableCell";

const AllGroups = () => {
  const groups = useSelector(state => state.students.groups);

  return (
    <div>
      <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto"></div>
      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <Table
              tableHeading="FYP Groups SE 18"
              isEmpty={groups && groups.length === 0}
              placeholder={"No Groups Found"}
              tableHeads={["Group Id", "Members", "Title", "Supervisor"]}
            >
              {groups && groups.length
                ? groups.map(group => (
                    <tr key={group.id}>
                      <TableCell>{group.id}</TableCell>
                      <TableCell>{group.members.join(", ")}</TableCell>
                      <TableCell>{group.projectTitle}</TableCell>
                      <TableCell>{group.supervisor}</TableCell>
                    </tr>
                  ))
                : null}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllGroups;
