const { Project, Group } = require("../models");

module.exports.createProject = async (req, res) => {
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
    const group = await Group.findOne({ where: { name: groupId } });
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
