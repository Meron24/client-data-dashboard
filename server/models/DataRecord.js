const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');

const DataRecord = sequelize.define('DataRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.JSON,  // Store each row as JSON object
    allowNull: false,
  },
});

// Associate DataRecord with Project (one-to-many)
DataRecord.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(DataRecord, { foreignKey: 'projectId', as: 'dataRecords' });

module.exports = DataRecord;
