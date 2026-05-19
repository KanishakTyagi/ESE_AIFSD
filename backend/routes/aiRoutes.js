const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Usually AI features might be protected, but keeping it simple or matching requirements. Let's protect it.
router.post('/analyze', authMiddleware, aiController.analyzeComplaint);

module.exports = router;
