require("dotenv").config();

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");
const dir = path.join(__dirname, "../uploads");
const sequelize = require("sequelize");
var crypto = require("crypto");
const { sendMail } = require("../utils/sendMails");
const {
  Department,
  Admin,
  FacultyMember,
  Deliverable,
  Version,
} = require("../models");

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
      //   const filePath = `${__dirname}/../uploads/${fileName}`;
      //   const filePath = `${dir}/${fileName}`;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });
      await deliverable.update({
        template: fileName,
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

  static downloadTemplateFile = async (req, res) => {
    const { deliverableId } = req.body;
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      const fileName = deliverable.template;
      //   const filePath = `${__dirname}/../uploads/${fileName}`;
      //   const filePath = `/uploads/${fileName}`;
      //   const filePath = `${dir}/${fileName}`;
      const filePath = path.join(dir, fileName);

      console.log(filePath);
      //   res.download(filePath);
      //   res.sendFile(filePath);
      res.status(200).json({
        message: "File downloaded successfully",
        download: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error downloading file",
        error,
        download: false,
      });
    }
  };
  static getDeliverableById = async (req, res) => {
    try {
      const { id } = req.params;
      const deliverable = await Deliverable.findOne({
        where: {
          id,
        },
      });

      res.json({
        message: "Deliverable fetched successfully",
        deliverable: {
          id: deliverable.id,
          title: deliverable.title,
          template: deliverable.template,
          deadline: deliverable.deadline,
          email: {
            body: deliverable.emailbody,
            subject: deliverable.emailsubject,
          },
        },
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting deliverable",
        error,
        get: false,
      });
    }
  };
  static editDeliverable = async (req, res) => {
    const { deliverableId, deadline, email } = req.body;
    try {
      const deliverable = await Deliverable.findOne({
        where: {
          id: deliverableId,
        },
      });
      await deliverable.update({
        deadline,
        emailbody: email.body,
        emailsubject: email.subject,
      });
      res.json({
        message: "Deliverable updated successfully",
        deliverable,
        update: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error editing deliverable",
        error,
        edit: false,
      });
    }
  };
  static getGroupDeliverableSubmission = async (req, res) => {
    const { deliverableId, groupId } = req.body;
    try {
      // console.log(deliverableId, groupId);
      // try{}
      const versions = await Version.findAll({
        where: {
          deliverableId,
          groupId,
        },
      });
      console.log(versions.dataValues);

      res.json({
        message: "Versions fetched successfully",
        versions,
        get: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting versions",
        error,
        get: false,
      });
    }
  };
  static submitGroupDeliverableSubmission = async (req, res) => {
    const { file } = req;
    const { deliverableId, groupId, projectId } = req.body;
    console.log(deliverableId, groupId, projectId);
    console.log(file);
    try {
      const submittedVersion = await Version.create({
        deliverableId,
        groupId,
        projectId,
      });
      const fileTitle = file.originalname;
      const versionId = submittedVersion.id;
      const title = fileTitle.split(".")[0] + "_" + versionId;
      const extension = fileTitle.split(".").pop();
      const fileName = title + "" + "." + extension;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });
      await submittedVersion.update({
        name: fileName,
      });

      res.json({
        message: "File uploaded successfully as " + fileName,
        upload: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error submitting version",
        error,
        submit: false,
      });
    }
  };
  static downloadGroupDeliverableSubmission = async (req, res) => {
    const { versionId } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      const fileName = version.name;
      const filePath = path.join(dir, fileName);
      console.log(filePath);
      res.status(200).json({
        message: "File downloaded successfully",
        download: true,
        file: fileName,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error downloading file",
        error,
        download: false,
      });
    }
  };
}
module.exports = DeliverableController;
