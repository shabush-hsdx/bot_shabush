const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const token = process.env.TOKEN;
const YOUR_ID = Number(process.env.YOUR_ID);
const GIRL_ID = Number(process.env.GIRL_ID);
const SECOND_ID = Number(process.env.SECOND_ID);

const bot = new TelegramBot(token, { polling: false }); // ❗ polling выключен
const app = express();

const URL = `https://${process.env.RENDER_EXTERNAL_URL}`; // Render URL
bot.setWebHook(`${URL}/bot${token}`); // устанавливаем webhook

app.use(express.json());

// 🩵 Telegram отправляет апдейты сюда
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// 🩵 Приветствие
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Seni seviyorum kadin!💌");
});

// 🔹 Логика сообщений
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (chatId === GIRL_ID) {
    const targets = [YOUR_ID, SECOND_ID].filter(Boolean);
    for (const target of targets) {
      if (msg.text) await bot.sendMessage(target, `💬 Kız: ${msg.text}`);
      if (msg.photo)
        await bot.sendPhoto(target, msg.photo[msg.photo.length - 1].file_id, {
          caption: msg.caption || "📸 Kız'dan fotoğraf",
        });
    }
    return;
  }

  if (chatId === YOUR_ID || chatId === SECOND_ID) {
    if (msg.text) await bot.sendMessage(GIRL_ID, msg.text);
    if (msg.photo)
      await bot.sendPhoto(GIRL_ID, msg.photo[msg.photo.length - 1].file_id, {
        caption: msg.caption,
      });
  }
});

// Render требует открыть порт:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
