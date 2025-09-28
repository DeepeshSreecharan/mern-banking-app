const express = require('express');
const atmController = require('../controllers/atm.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/request', validate(schemas.requestATMCard), atmController.requestCard);
router.get('/', atmController.getCards);
router.get('/:cardId/details', atmController.getCardDetails);
router.post('/set-pin', validate(schemas.setATMPin), atmController.setPin);
router.post('/change-pin', validate(schemas.changeATMPin), atmController.changePin);
router.post('/:cardId/toggle-block', atmController.toggleBlockCard);

module.exports = router;