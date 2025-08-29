const express = require('express');
const router = express.Router();
const { sendEmail } = require('../config/nodemailer');

router.post('/', async (req, res) => {
  const { productId, question, userName, userEmail } = req.body;

  const whatsappLink = `https://wa.me/${process.env.WHATSAPP_NUMBER.replace('+', '')}?text=Producto%20ID:${productId}%0AUsuario:%20${userName}%20(${userEmail})%0APregunta:%20${encodeURIComponent(question)}`;

  try {
    await sendEmail(
      process.env.EMAIL_USER,
      `Nueva pregunta sobre producto #${productId}`,
      `Pregunta: ${question}\nUsuario: ${userName} (${userEmail})\nProducto ID: ${productId}`,
      `<p><strong>Pregunta:</strong> ${question}</p>
       <p><strong>Usuario:</strong> ${userName} (${userEmail})</p>
       <p><strong>Producto ID:</strong> ${productId}</p>
       <a href="${whatsappLink}" target="_blank">Responder por WhatsApp</a>`
    );

    res.json({ message: 'Pregunta enviada', whatsappLink });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = router;