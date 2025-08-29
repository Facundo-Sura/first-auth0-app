const Review = require('../models/Review');
const { sendEmail } = require('../config/nodemailer');

// Cuando el producto llega, llama a esta función (manual o desde webhook de envío)
exports.notifyForReview = async (orderId, userEmail, userName, productId) => {
  try {
    await sendEmail(
      userEmail,
      '¿Cómo estuvo tu producto?',
      `Hola ${userName}, esperamos que tu producto haya llegado bien. ¡Cuéntanos qué te pareció!`,
      `<h3>¿Cómo estuvo tu producto?</h3>
       <p>Por favor, déjanos una reseña para ayudarnos a mejorar.</p>
       <a href="${process.env.FRONTEND_URL}/product/${productId}#reviews" target="_blank">Dejar reseña</a>`
    );
  } catch (error) {
    console.error('Error sending review email:', error);
  }
};

exports.createReview = async (req, res) => {
  const { product_id, user_name, rating, comment } = req.body;
  try {
    const [review] = await Review.createReview({
      product_id,
      user_name,
      rating,
      comment,
      created_at: new Date()
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.getReviewsByProduct(req.params.productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};