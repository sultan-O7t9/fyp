const { Project, Group } = require("../models");

class ProjectController {
  static createProject = async (req, res) => {
    const { title, description, type, dev_tech, platform, groupId } = req.body;
    console.log(req.body);
    try {
      const project = await Project.create({
        title,
        description,
        type,
        dev_tech,
        platform,
      });
      const group = await Group.findOne({ where: { id: groupId } });
      await group.update({ projectId: project.dataValues.id });
      console.log(project.dataValues);
      res.status(200).json({
        message: "Project created successfully",
        project,
      });
    } catch (err) {
      console.log(error);
      res.status(500).json({ message: err });
    }
  };
  static getProjectByGroup = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const group = await Group.findOne({ where: { id: id } });
      console.log(group.dataValues);
      const project = await Project.findOne({
        where: { id: group.dataValues.projectId },
      });
      console.log(project.dataValues);
      res.status(200).json({
        get: true,
        message: "Project fetched successfully",
        project,
      });
    } catch (err) {
      console.log(error);
      res.status(500).json({ message: err });
    }
  };
}

module.exports = ProjectController;
