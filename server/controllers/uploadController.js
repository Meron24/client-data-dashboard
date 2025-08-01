const multer = require('multer');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const path = require('path');
const DataRecord = require('../models/DataRecord');
const Project = require('../models/Project');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = require('stream');
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const parseExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  const rows = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = worksheet.getRow(1).getCell(colNumber).value;
      rowData[header] = cell.value;
    });
    rows.push(rowData);
  });

  return rows;
};

const handleFileUpload = async (req, res) => {
  try {
    const projectId = req.body.projectId;
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let parsedData;
    if (ext === '.csv') {
      parsedData = await parseCSV(fileBuffer);
    } else if (ext === '.xls' || ext === '.xlsx') {
      parsedData = await parseExcel(fileBuffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Save parsed data as DataRecord entries linked to project
    const recordsToCreate = parsedData.map((row) => ({
      data: row,
      projectId,
    }));

    const createdRecords = await DataRecord.bulkCreate(recordsToCreate);

    res.json({ message: 'File parsed and data saved successfully', count: createdRecords.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to parse and save file data', error: error.message });
  }
};

module.exports = {
  upload,
  handleFileUpload,
};
