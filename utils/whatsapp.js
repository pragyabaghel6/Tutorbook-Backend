// Supports Twilio WhatsApp or Meta Cloud API — configure via env vars

async function sendWhatsApp(to, message) {
  // Twilio path
  if (process.env.TWILIO_ACCOUNT_SID) {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await twilio.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${to.replace(/\D/g, '').slice(-10)}`,
      body: message,
    });
    return { success: true };
  }

  // Meta Cloud API path
  if (process.env.META_WHATSAPP_TOKEN) {
    const axios = require('axios');
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: `91${to.replace(/\D/g, '').slice(-10)}`,
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}` } }
    );
    return { success: true };
  }

  console.warn('No WhatsApp provider configured. Message not sent:', message);
  return { success: false };
}

module.exports = { sendWhatsApp };
