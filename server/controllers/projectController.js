const Project = require('../models/Project');
const DataRecord = require('../models/DataRecord');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const userId = req.user.id;

    const project = await Project.create({ projectName, description, userId });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// Get all projects for logged-in user
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.findAll({ where: { userId } });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

// Get single project with its data records
const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({
      where: { id, userId },
      include: [{ model: DataRecord, as: 'dataRecords' }],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project details', error: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectDetails };
