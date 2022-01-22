export const IMPORT_STUDENTS = "IMPORT_STUDENTS";

export const importStudents = students => {
  return {
    type: IMPORT_STUDENTS,
    payload: students,
  };
};
