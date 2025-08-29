const Order = require('../models/Order');
const { sendEmail } = require('../config/nodemailer');
const mp = require('mercadopago');
mp.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });

exports.createOrder = async (req, res) => {
  const { items, total, buyerInfo, paymentMethod = 'mercadopago' } = req.body;

  try {
    const [order] = await Order.createOrder({
      user_id: buyerInfo.userId || null,
      items: JSON.stringify(items),
      total,
      status: 'pending',
      buyer_info: JSON.stringify(buyerInfo),
      payment_method: paymentMethod,
      created_at: new Date()
    });

    // Enviar correo de confirmación
    await sendEmail(
      buyerInfo.email,
      'Confirmación de compra',
      `Tu pedido #${order.id} ha sido recibido y está siendo preparado.`,
      `<h2>¡Gracias por tu compra!</h2>
       <p>Pedido #${order.id}</p>
       <p>Estado: Preparando para envío</p>
       <p>Total: $${total}</p>
       <p>Pronto recibirás una actualización.</p>`
    );

    // Notificación al admin por nuevo usuario
    if (!buyerInfo.userId) {
      await sendEmail(
        process.env.EMAIL_USER,
        'Nuevo cliente registrado (anónimo)',
        `Nuevo cliente: ${buyerInfo.name} - ${buyerInfo.email}`
      );
    }

    // Crear preferencia de Mercado Pago
    const preference = {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS'
      })),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/orders/mercadopago/webhook`
    };

    const preferenceResponse = await mp.preferences.create(preference);
    res.json({ order, init_point: preferenceResponse.body.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleMercadoPagoWebhook = (req, res) => {
  const payment = req.body;
  console.log('Webhook recibido:', payment);
  // Actualizar estado de orden
  res.status(200).send('OK');
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};