const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/product/:productId', reviewController.getReviewsByProduct);

module.exports = router;