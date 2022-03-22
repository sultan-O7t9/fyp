const { Department } = require("../models");

module.exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json({
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting departments",
      error,
    });
  }
};
