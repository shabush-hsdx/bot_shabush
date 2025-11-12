// ==============================
// 💌 Only for you, bebegim ✨
// Stable Render version (Webhook + Ping route)
// ==============================

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

// 🔐 ENV variables
const token = process.env.TOKEN;
const YOUR_ID = Number(process.env.YOUR_ID);
const GIRL_ID = Number(process.env.GIRL_ID);
const SECOND_ID = Number(process.env.SECOND_ID);
const URL = process.env.RENDER_EXTERNAL_URL;

// 🧠 Helper: elegant logger
const log = (msg) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

// ==============================
// 💬 Bot setup with webhook
// ==============================
const bot = new TelegramBot(token, { polling: false });

bot
  .setWebHook(`https://${URL}/bot${token}`)
  .then(() => log("✅ Webhook registered successfully"))
  .catch((err) => log(`⚠️ Webhook error: ${err.message}`));

// 📩 Handle Telegram updates via POST
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ==============================
// ✨ Message Handlers
// ==============================

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🌸 *Seni seviyorum kadin!* 💌\nBu bot sadece senin ve benim için.",
    { parse_mode: "Markdown" },
  );
  log(`🚀 /start from ${msg.chat.username || msg.chat.id}`);
});

// 💌 Main message handler
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const isFromYou = chatId === YOUR_ID;
  const isFromGirl = chatId === GIRL_ID || chatId === SECOND_ID;

  try {
    if (isFromGirl) {
      await forwardToYou(msg);
      log(`💬 From girl: ${text.slice(0, 50)}`);
      return;
    }

    if (isFromYou) {
      await forwardToGirls(msg);
      log(`📤 From you: ${text.slice(0, 50)}`);
    }
  } catch (err) {
    log(`🚨 Message handling error: ${err.message}`);
  }
});

// ==============================
// 💫 Forwarding functions
// ==============================

async function forwardToYou(msg) {
  const senderName = msg.chat.id === GIRL_ID ? "Shabush" : "6497";

  const options = { parse_mode: "Markdown" };

  if (msg.text)
    await bot.sendMessage(YOUR_ID, `💬 *${senderName}:* ${msg.text}`, options);
  if (msg.photo)
    await bot.sendPhoto(YOUR_ID, msg.photo.at(-1).file_id, {
      caption: `📸 ${senderName} fotoğraf gönderdi`,
    });
  if (msg.video)
    await bot.sendVideo(YOUR_ID, msg.video.file_id, {
      caption: `🎬 ${senderName} video gönderdi`,
    });
  if (msg.audio)
    await bot.sendAudio(YOUR_ID, msg.audio.file_id, {
      caption: `🎵 ${senderName} müzik gönderdi`,
    });
  if (msg.voice) await bot.sendVoice(YOUR_ID, msg.voice.file_id);
  if (msg.document) await bot.sendDocument(YOUR_ID, msg.document.file_id);
}

async function forwardToGirls(msg) {
  const girls = [GIRL_ID, SECOND_ID].filter(Boolean);

  for (const girl of girls) {
    if (msg.text) await bot.sendMessage(girl, msg.text);
    if (msg.photo)
      await bot.sendPhoto(girl, msg.photo.at(-1).file_id, {
        caption: msg.caption,
      });
    if (msg.video)
      await bot.sendVideo(girl, msg.video.file_id, {
        caption: msg.caption,
      });
    if (msg.audio)
      await bot.sendAudio(girl, msg.audio.file_id, {
        caption: msg.caption,
      });
    if (msg.voice) await bot.sendVoice(girl, msg.voice.file_id);
    if (msg.document) await bot.sendDocument(girl, msg.document.file_id);
  }
}

// ==============================
// 🌐 Express server + Ping route
// ==============================

app.get("/", (req, res) => {
  res.status(200).send("🤖 Bot is alive and waiting for you, bebegim 💞");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => log(`✅ Server running on port ${PORT}`));
