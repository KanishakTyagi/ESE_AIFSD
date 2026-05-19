const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', complaintController.addComplaint);
router.get('/', complaintController.getAllComplaints);
router.get('/search', complaintController.searchByLocation);
router.put('/:id', authMiddleware, complaintController.updateStatus);
router.delete('/:id', authMiddleware, complaintController.deleteComplaint);

module.exports = router;
