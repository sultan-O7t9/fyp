import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImportFromExcel from "../../components/ImportFromExcel";
import Table from "../../components/UI/Table";
import TableCell from "../../components/UI/Table/TableCell";
import { fetchStudents, importStudents } from "../../store/actions/students";

const AllStudents = () => {
  const students = useSelector(state => state.students.students);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const importExcelHandler = data => {
    //Map Excel Data to Students Array
    data.shift();
    //Some arrays had 0 length, so we need to remove them
    const filteredData = data.filter(student => student.length > 0);
    const tempStudents = filteredData.map(student => {
      return {
        rollNo: student[0],
        name: student[1],
        department: student[2],
        batch: student[3],
        email: student[0] + "@uog.edu.pk",
      };
    });
    tempStudents.sort(
      (a, b) => a.rollNo.split("-")[1] - b.rollNo.split("-")[1]
    );
    dispatch(importStudents(tempStudents));
  };
  const nav = (
    <div className="w-full flex flex-row justify-start">
      <ImportFromExcel onImportFromExcel={importExcelHandler} />
    </div>
  );

  return (
    <div>
      <div className="bg-primary pt-14 pb-28 px-3 md:px-8 h-auto"></div>
      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <Table
              data={students}
              tableHeading="Students"
              nav={nav}
              isEmpty={students && students.length === 0}
              placeholder={"No Students Found"}
              tableHeads={["Roll No ", "Name", "Department", "Email", "Group"]}
            >
              {students && students.length
                ? students.map(student => (
                    <tr key={student.rollNo}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        {student.department} {student.batch}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {student.groupId ? student.groupId : "None"}
                        </span>
                      </TableCell>
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

export default AllStudents;
