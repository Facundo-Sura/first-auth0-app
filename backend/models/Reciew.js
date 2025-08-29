const db = require('../config/db');

const createReview = (review) => db('reviews').insert(review).returning('*');

const getReviewsByProduct = (productId) => db('reviews').where({ product_id: productId }).select('*');

module.exports = { createReview, getReviewsByProduct };