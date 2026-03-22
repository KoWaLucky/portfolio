/**
 * Vercel Serverless: форма → уведомление в Telegram
 * Добавь в Vercel Environment: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { name = '', email = '', message = '' } = req.body || {};

  const text = `📧 Новое сообщение с сайта Carma

👤 Имя: ${String(name).slice(0, 100)}
📩 Email: ${String(email).slice(0, 100)}

💬 Сообщение:
${String(message).slice(0, 2000)}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Telegram error:', err);
      return res.status(500).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
