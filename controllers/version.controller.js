const {
  Department,
  Admin,
  FacultyMember,
  Batch,
  Faculty_Role,
  PMO,
  Version,
} = require("../models");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");

const dir = path.join(__dirname, "../uploads");

class VersionController {
  static addComment = async (req, res) => {
    const { versionId, comment } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      if (!version) {
        return res.status(404).json({
          message: "Version not found",
        });
      }
      await version.update({
        comment,
      });

      res.json({
        message: "Comment added successfully",
        version,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error adding comment",
        error: err,
      });
    }
  };
  static changeEndorsementStatus = async (req, res) => {
    const { versionId, status } = req.body;
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      if (!version) {
        return res.status(404).json({
          message: "Version not found",
        });
      }
      await version.update({
        status: status,
      });

      res.json({
        message: "Endorsement status changed successfully",
        version,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error changing endorsement status",
        error: err,
      });
    }
  };
  static uploadCommentedDoc = async (req, res) => {
    const { file } = req;
    const { versionId } = req.body;
    // console.log(deliverableId);
    try {
      const version = await Version.findOne({
        where: {
          id: versionId,
        },
      });
      if (
        file.detectedFileExtension != ".docx" ||
        file.detectedFileExtension != ".doc"
      )
        new Error("Invalid file type");
      const fileTitle = file.originalname;
      //   const version_id = submittedVersion.id;
      const title = fileTitle.split(".")[0];
      const extension = fileTitle.split(".").pop();
      const fileName = title + "_commented" + "." + extension;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });

      await version.update({
        commented_doc: fileName,
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
}
module.exports = VersionController;
