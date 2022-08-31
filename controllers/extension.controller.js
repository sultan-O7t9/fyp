const sequelize = require("sequelize");
const { Extension, Group } = require("../models");

class ExtensionController {
  static requestExtension = async (req, res) => {
    const { days, deliverableId, groupId, supervisorId } = req.body;
    try {
      const alreadyExistedExtension = await Extension.findOne({
        where: {
          deliverableId,
          groupId,
          days,
        },
      });
      if (alreadyExistedExtension) {
        return res.json({
          message: "Extension already requested",
          extension: alreadyExistedExtension,
          create: false,
        });
      }
      const extension = await Extension.create({
        days,
        deliverableId,
        groupId,
        supervisorId,
        status: "Pending",
      });
      res.json({
        message: "Extension requested successfully",
        extension,
        create: false,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error requesting extension",
        error,
      });
    }
  };
  static changeStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
      const extension = await Extension.findOne({
        where: {
          id: id,
        },
      });
      if (extension) {
        if (status == "Rejected") await extension.destroy();
        await extension.update({
          status: status,
        });
        res.json({
          message: "Status changed successfully",
          extension,
        });
      } else
        res.status(400).json({
          message: "Invalid Extension Id",
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error changing status",
        error,
      });
    }
  };
  static getExtensions = async (req, res) => {
    const { deliverableId } = req.body;
    try {
      const extensions = await Extension.findAll({
        where: {
          deliverableId,
          status: "Pending",
        },
      });
      const detailedEx = await Promise.all(
        extensions.map(async extension => {
          const group = await Group.findOne({
            where: {
              id: extension.groupId,
            },
          });
          return {
            ...extension.dataValues,
            group: group.name,
          };
        })
      );
      res.json({
        message: "Extensions fetched successfully",
        extensions: detailedEx,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting extensions",
        error,
      });
    }
  };
  static getExtension = async (req, res) => {
    const { deliverableId, groupId } = req.body;
    try {
      const extension = await Extension.findOne({
        where: {
          deliverableId,
          groupId,
          status: "Approved",
        },
      });
      console.log("EX", extension);
      if (extension) {
        res.json({
          message: "Extension fetched successfully",
          extension,
        });
      } else {
        res.status(200).json({
          message: "Invalid Extension Id",
          extension: { days: 0 },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error getting extensions",
        error,
      });
    }
  };
}
module.exports = ExtensionController;
