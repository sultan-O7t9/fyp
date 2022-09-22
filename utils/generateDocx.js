const fs = require("fs");
const easyTemplate = require("easy-template-x");
const path = require("path");
const TemplateHandler = easyTemplate.TemplateHandler;
const dir = path.join(__dirname, "../utils");
const dir2 = path.join(__dirname, "../uploads");

const generateFypFinalPerforma = async (
  data,
  session = `${new Date().getFullYear() - 4} - ${new Date().getFullYear()}`
) => {
  const date = new Date().toDateString().split(" ").slice(1).join(" ");

  // const oriData = {
  //   students: [
  //     {
  //       department: "Software Engineering",
  //       name: "Sultan Muhammad",
  //       rollNo: "18094198-079",
  //       class: "BSSE",
  //       session: "2018 - 2022",
  //       projectTitle: "PMO Management System",
  //       supervisor: "Muhammad Ejaz",
  //       date: date,
  //       evaluator1name: "Gulsher Ali",
  //       evaluator1desig: "Lecturer",
  //       evaluator2name: "Adeel Ahmad",
  //       evaluator2desig: "Lecturer",
  //       total: 150,
  //       percentage: 75,
  //     },
  //     {
  //       department: "Software Engineering",
  //       name: "Sultan Muhammad",
  //       rollNo: "18094198-079",
  //       class: "BSSE",
  //       session: "2018 - 2022",
  //       projectTitle: "PMO Management System",
  //       supervisor: "Muhammad Ejaz",
  //       date: date,
  //       evaluator1name: "Gulsher Ali",
  //       evaluator1desig: "Lecturer",
  //       evaluator2name: "Adeel Ahmad",
  //       evaluator2desig: "Lecturer",
  //       total: 150,
  //       percentage: 75,
  //     },
  //   ],
  // };

  const filePath = path.join(dir, "FYP_Final_Result_Proforma_template.docx");
  const templateFile = fs.readFileSync(filePath);
  console.log(dir);
  // console.log(data);

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);
  const fname = `FYP Final Result Proforma BSSE ${session}.docx`;
  const file2 = path.join(dir2, fname);
  fs.writeFileSync(file2, doc);
  // res.download(file2);
  return fname;
};

module.exports = {
  generateFypFinalPerforma,
};
