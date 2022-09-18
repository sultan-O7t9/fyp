const {
  Department,
  Admin,
  FacultyMember,
  Batch,
  Faculty_Role,
  PMO,
  Version,
  CommitteeReview,
  Student,
  Group,
} = require("../models");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");
const { sendMail } = require("../utils/sendMails");

const dir = path.join(__dirname, "../uploads");

class CommitteeReviewController {
  static addComment = async (req, res) => {
    const { reviewId, comment } = req.body;
    try {
      const review = await CommitteeReview.findOne({
        where: {
          id: reviewId,
        },
      });
      if (!review) {
        return res.status(404).json({
          message: "review not found",
        });
      }
      await review.update({
        comment,
      });

      res.json({
        message: "Comment added successfully",
        review,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error adding comment",
        error: err,
      });
    }
  };
  static getEndorsementStatus = async (req, res) => {
    const { groupId, deliverableId, committeeId } = req.body;
    try {
      const review = await CommitteeReview.findOne({
        where: {
          groupId,
          deliverableId,
          committeeId,
        },
      });
      if (!review) {
        const newReview = await CommitteeReview.create({
          groupId,
          deliverableId,
          committeeId,
        });
        return res.json({
          message: "Review created successfully",
          review: newReview,
        });
      }
      res.json({
        message: "Review fetched successfully",
        review,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error getting endorsement status",
        error: err,
      });
    }
  };
  static changeEndorsementStatus = async (req, res) => {
    const { groupId, deliverableId, committeeId, status, versionId, date } =
      req.body;
    try {
      const groupDetails = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      if (status == "Revised") {
        const members = await Student.findAll({
          where: {
            groupId: groupId,
          },
        });
        const supervisor = await FacultyMember.findOne({
          where: {
            id: groupDetails.dataValues.supervisorId,
          },
        });
        const recipiants = members
          .map(member => {
            return member.dataValues.rollNo + "@uog.edu.pk";
          })
          .push(supervisor ? supervisor.dataValues.email : "");

        sendMail(
          // [recipiants].map(student => {
          ["18094198-079@uog.edu.pk"].map(student => {
            return {
              email: student,
              subject: "Evaluation Revision of Deliverable " + deliverableId,
              body: `
            The revision date for group ${
              groupDetails.dataValues.name
            } has been set to ${new Date(date).toDateString()}.
         `,
            };
          })
        );
      }
      //Check if exists
      const review = await Version.findOne({
        where: {
          id: versionId,
        },
      });

      if (!review) {
        const newReview = await Version.create({
          deliverableId: deliverableId,
          groupId: groupId,
          committeeId: committeeId,
          eval_status: status,
        });
        return res.json({
          message: "Status changed successfully",
          review: newReview,
        });
      }
      await review.update({
        eval_status: status,
        revision_date: date,
      });

      res.json({
        message: "Status changed successfully",
        review,
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
    const { reviewId } = req.body;
    // console.log(deliverableId);
    try {
      // const version = await Version.findOne({
      //   where: {
      //     id: versionId,
      //   },
      // });
      const review = await Version.findOne({
        where: {
          id: reviewId,
        },
      });

      const fileTitle = file.originalname;
      //   const version_id = submittedVersion.id;
      const title = fileTitle.split(".")[0];
      const extension = fileTitle.split(".").pop();
      const fileName = title + "_eval_comment" + "." + extension;
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, file.buffer, err => {
        if (err) throw err;
      });

      await review.update({
        eval_commented_doc: fileName,
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
module.exports = CommitteeReviewController;
