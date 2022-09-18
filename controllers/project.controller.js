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
      console.log(err);
      res.status(500).json({ message: err });
    }
  };
  static updateProject = async (req, res) => {
    const { title, description, type, dev_tech, platform, id } = req.body;
    console.log(req.body);
    try {
      const proj = await Project.findOne({
        id: id,
      });
      if (!proj) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
      // await proj.update({
      //   title,
      //   description,
      //   type,
      //   dev_tech,
      //   platform,
      // });
      await Project.update(
        {
          title,
          description,
          type,
          dev_tech,
          platform,
        },
        {
          where: {
            id: id,
          },
        }
      );

      console.log(proj);
      res.status(200).json({
        message: "Project update successfully",
        project: proj,
      });
    } catch (err) {
      console.log(err);
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
      // console.log(project.dataValues);
      res.status(200).json({
        get: true,
        message: "Project fetched successfully",
        project,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err, get: false });
    }
  };
}

module.exports = ProjectController;
