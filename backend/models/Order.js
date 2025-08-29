const db = require('../config/db');

const createOrder = (order) => db('orders').insert(order).returning('*');

const getOrderById = (id) => db('orders').where({ id }).first();

const getOrdersByUser = (userId) => db('orders').where({ user_id: userId });

module.exports = { createOrder, getOrderById, getOrdersByUser };