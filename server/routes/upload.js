const express = require('express');
const router = express.Router();
const { upload, handleFileUpload } = require('../controllers/uploadController');

router.post('/', upload.single('file'), handleFileUpload);

module.exports = router;
