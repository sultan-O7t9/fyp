import React from "react";

import { Card, CardHeader, CardBody, Heading4 } from "@material-tailwind/react";

import TableHead from "./TableHead";
import TableNavbar from "./TableNavbar";

const Table = props => {
  const { tableHeading, tableHeads, children, nav, placeholder, isEmpty } =
    props;

  return (
    <Card>
      <CardHeader color="purple" contentPosition="left">
        <h2 className="text-white text-2xl ">{tableHeading}</h2>
      </CardHeader>
      <TableNavbar>{nav}</TableNavbar>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {tableHeads && tableHeads.length
                  ? tableHeads.map(heading => (
                      <TableHead key={heading}>{heading}</TableHead>
                    ))
                  : null}
              </tr>
            </thead>

            <tbody>
              {isEmpty ? (
                <tr>
                  <td>
                    <Heading4 color="blueGray">{placeholder}</Heading4>
                  </td>
                </tr>
              ) : (
                children
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default Table;
