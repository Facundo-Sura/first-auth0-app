const db = require('../config/db');

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const [item] = await db('cart').insert({
      user_id: userId || null,
      product_id: productId,
      quantity
    }).returning('*');
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const items = await db('cart')
      .join('products', 'cart.product_id', 'products.id')
      .select('cart.*', 'products.name', 'products.price', 'products.media_urls')
      .where('cart.user_id', userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};