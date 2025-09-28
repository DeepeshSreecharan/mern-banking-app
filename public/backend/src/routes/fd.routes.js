const express = require('express');
const fdController = require('../controllers/fd.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

const router = express.Router();

// All FD routes require user to be logged in
router.use(authMiddleware);

// Create FD
router.post('/create', validate(schemas.createFD), fdController.createFD);

// Get all FDs
router.get('/', fdController.getFDs);

// Get FD details
router.get('/:fdId', fdController.getFDDetails);

// Break FD
router.post('/:fdId/break', fdController.breakFD);

module.exports = router;
