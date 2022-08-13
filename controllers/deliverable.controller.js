require("dotenv").config();

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

const sequelize = require("sequelize");
var crypto = require("crypto");
const { sendMail } = require("../utils/sendMails");
const { Department, Admin, FacultyMember, Deliverable } = require("../models");

class DeliverableController {
  static getAllDeliverables = async (req, res) => {
    try {
      const deliverables = await Deliverable.findAll();
      res.json({
        message: "Deliverables fetched successfully",
        deliverables,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting deliverables",
        error,
        get: false,
      });
    }
  };
  static createDeliverable = async (req, res) => {
    try {
      const { title } = req.body;
      const deliverable = await Deliverable.create({
        title,
      });
      res.json({
        message: "Deliverable created successfully",
        deliverable,
        create: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error creating deliverable",
        error,
        create: false,
      });
    }
  };
  static addTemplateFile = async (req, res) => {
    const { file } = req;
    const { deliverableId } = req.body;
    console.log(deliverableId);
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });

      //   console.log(file);
      //   fileExtension = file.detectedFileExtension;
      //   console.log("EX", fileExtension);
      if (
        file.detectedFileExtension != ".docx" ||
        file.detectedFileExtension != ".doc"
      )
        new Error("Invalid file type");
      const title = deliverable.title;

      const fileName =
        title.replace(" ", "_") +
        "_template_" +
        new Date().getYear() +
        new Date().getMonth() +
        new Date().getDay() +
        "." +
        file.originalname.split(".").pop();
      // await pipeline(
      //   file.buffer,
      //   fs.createWriteStream(`${__dirname}/../uploads/${fileName}`)
      // );
      const filePath = `${__dirname}/../uploads/${fileName}`;
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });
      await deliverable.update({
        templateFile: fileName,
      });

      res.json({
        message: "File uploaded successfully as " + fileName,
        upload: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error uploading file",
        error,
        upload: false,
      });
    }
  };

  static downloadTemplateFile = async (req, res) => {};
}
module.exports = DeliverableController;
