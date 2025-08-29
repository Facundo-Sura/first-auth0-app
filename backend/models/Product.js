const db = require('../config/db');

const getAllProducts = () => db('products').select('*');

const getProductById = (id) => db('products').where({ id }).first();

const createProduct = (product) => db('products').insert(product).returning('*');

const updateProduct = (id, updates) => db('products').where({ id }).update(updates).returning('*');

const deleteProduct = (id) => db('products').where({ id }).del();

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};