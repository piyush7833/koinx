
const express = require('express');
const { getStats, getDeviation } = require('../controllers/crypto');

const router = express.Router();

router.get('/stats', getStats);
router.get('/deviation', getDeviation);

module.exports = router;
