const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Associate Project with User (one-to-many)
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });

module.exports = Project;
