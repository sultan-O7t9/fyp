const fs = require("fs");
const easyTemplate = require("easy-template-x");
const path = require("path");
const TemplateHandler = easyTemplate.TemplateHandler;
const dir = path.join(__dirname, "../utils");

const generateDocx = async (req, res) => {
  const filePath = path.join(dir, "FYP_Final_Result_Proforma_template.docx");
  const templateFile = fs.readFileSync(filePath);
  console.log(dir);
  const date = new Date().toDateString().split(" ").slice(1).join(" ");

  const data = {
    students: [
      {
        department: "Software Engineering",
        name: "Sultan Muhammad",
        rollNo: "18094198-079",
        class: "BSSE",
        session: "2018 - 2022",
        projectTitle: "PMO Management System",
        supervisor: "Muhammad Ejaz",
        date: date,
        evaluator1name: "Gulsher Ali",
        evaluator1desig: "Lecturer",
        evaluator2name: "Adeel Ahmad",
        evaluator2desig: "Lecturer",
        total: 150,
        percentage: 75,
      },
      {
        department: "Software Engineering",
        name: "Sultan Muhammad",
        rollNo: "18094198-079",
        class: "BSSE",
        session: "2018 - 2022",
        projectTitle: "PMO Management System",
        supervisor: "Muhammad Ejaz",
        date: date,
        evaluator1name: "Gulsher Ali",
        evaluator1desig: "Lecturer",
        evaluator2name: "Adeel Ahmad",
        evaluator2desig: "Lecturer",
        total: 150,
        percentage: 75,
      },
    ],
  };

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);
  const file2 = path.join(dir, "output.docx");
  fs.writeFileSync(file2, doc);
  res.send("done");
};

module.exports = {
  generateDocx,
};
