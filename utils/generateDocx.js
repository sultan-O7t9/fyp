const fs = require("fs");
const easyTemplate = require("easy-template-x");
const path = require("path");
const TemplateHandler = easyTemplate.TemplateHandler;
const dir = path.join(__dirname, "../utils");
const dir2 = path.join(__dirname, "../uploads");
const docxConverter = require("docx-pdf");
const convertMultiple = require("convert-multiple-files");
const convertWordFiles = convertMultiple.convertWordFiles;

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
  const file2Pdf = path.join(
    dir2,
    `FYP Final Result Proforma BSSE ${session}.pdf`
  );
  fs.writeFileSync(file2, doc);
  // docxConverter(file2, file2Pdf, function (err, result) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log("result" + result);
  // });
  console.log(dir2);
  console.log(file2);
  try {
    const outputFile = await convertWordFiles(file2, "pdf", file2Pdf);
  } catch (error) {
    console.log(error);
  }

  // res.download(file2);
  return fname;
};
const generateCoverLetter = async (
  data,
  session = `${new Date().getFullYear() - 4} - ${new Date().getFullYear()}`
) => {
  const date = new Date().toDateString().split(" ").slice(1).join(" ");

  // const data = {
  //   department: "Software Engineering",
  //   students: [
  //     {
  //       department: "Software Engineering",
  //       name: "Sultan Muhammad",
  //       rollNo: "18094198-079",
  //       projectTitle: "PMO Management System",
  //       srNo: 1,
  //     },
  //     {
  //       name: "Ali Ikram",
  //       rollNo: "18094198-089",
  //     },
  //     {
  //       name: "Muneeb Arfan",
  //       rollNo: "18094198-118",
  //       projectTitle: "PMO Management System",
  //       srNo: 1,
  //     },
  //     {
  //       name: "Ahmad Raza",
  //       rollNo: "18094198-111",
  //     },
  //     {
  //       name: "Afham Hanif",
  //       rollNo: "18094198-096",
  //     },
  //   ],
  // };

  const filePath = path.join(dir, "cover_letter_FYP_submission_template.docx");
  const templateFile = fs.readFileSync(filePath);
  console.log(dir);
  // console.log(data);

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);
  const fname = `cover_letter_FYP_submission ${session}.docx`;
  const file2 = path.join(dir2, fname);
  fs.writeFileSync(file2, doc);
  // res.download(file2);
  return fname;
};

module.exports = {
  generateFypFinalPerforma,
  generateCoverLetter,
};
