import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import TableItem from "./TableItem";
import ImportFromExcel from "../ImportFromExcel";
import { useEffect, useState } from "react";
import classes from "./TableCard.module.css";

const GROUPS = [
  {
    id: "1SE18",
    members: ["18094198-048", "18094198-079", "18094198-089"],
    projectTitle: "PMO Management System",
    supervisor: "Muhammad Ejaz",
  },
];

export default function CardTable() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  return (
    <Card>
      <CardHeader color="purple" contentPosition="left">
        <h2 className="text-white text-2xl ">SE 18 FYP Groups</h2>
        <div className={classes.btnPosition}>
          <ImportFromExcel setGroups={setGroups} />
        </div>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Group Id
                </th>
                <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Members
                </th>
                <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Title
                </th>
                <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Supervised By
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.length
                ? groups.map(group => (
                    <TableItem
                      key={group.id}
                      id={group.id}
                      members={group.members}
                      title={group.projectTitle}
                      supervisor={group.supervisor}
                    />
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
