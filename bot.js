const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const token = process.env.TOKEN;
const YOUR_ID = Number(process.env.YOUR_ID);
const GIRL_ID = Number(process.env.GIRL_ID);
const SECOND_ID = Number(process.env.SECOND_ID);

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

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // === если пишет девушка (основная или вторая) ===
  if (chatId === GIRL_ID || chatId === SECOND_ID) {
    try {
      if (msg.text) await bot.sendMessage(YOUR_ID, `💬 Kız: ${msg.text}`);
      if (msg.photo)
        await bot.sendPhoto(YOUR_ID, msg.photo.at(-1).file_id, {
          caption: msg.caption || "📸 Kız'dan fotoğraf",
        });
      if (msg.audio)
        await bot.sendAudio(YOUR_ID, msg.audio.file_id, {
          caption: "🎵 Kız'dan müzik",
        });
      if (msg.video)
        await bot.sendVideo(YOUR_ID, msg.video.file_id, {
          caption: "🎬 Kız'dan video",
        });
      if (msg.voice) await bot.sendVoice(YOUR_ID, msg.voice.file_id);
      if (msg.document) await bot.sendDocument(YOUR_ID, msg.document.file_id);

      console.log("📨 Mesaj kız(lar)dan geldi, sana iletildi.");
    } catch (err) {
      console.error("🚨 Hata (kızdan gelen mesajı iletirken):", err);
    }
    return;
  }

  // === если пишешь ты ===
  if (chatId === YOUR_ID) {
    try {
      // отправляем обоим девушкам
      const girls = [GIRL_ID, SECOND_ID].filter(Boolean);
      for (const girl of girls) {
        if (msg.text) await bot.sendMessage(girl, msg.text);
        if (msg.photo)
          await bot.sendPhoto(girl, msg.photo.at(-1).file_id, {
            caption: msg.caption,
          });
        if (msg.audio)
          await bot.sendAudio(girl, msg.audio.file_id, {
            caption: msg.caption,
          });
        if (msg.video)
          await bot.sendVideo(girl, msg.video.file_id, {
            caption: msg.caption,
          });
        if (msg.voice) await bot.sendVoice(girl, msg.voice.file_id);
        if (msg.document) await bot.sendDocument(girl, msg.document.file_id);
      }

      console.log("✅ Mesaj her iki kıza gönderildi!");
    } catch (error) {
      const desc = error?.response?.body?.description;
      if (desc === "Bad Request: chat not found") {
        await bot.sendMessage(
          YOUR_ID,
          "⚠️ Kız henüz bota yazmadı, bu yüzden mesaj gönderilemiyor 💬",
        );
      } else {
        console.error("🚨 Beklenmeyen hata:", error);
        await bot.sendMessage(YOUR_ID, "🚨 Beklenmeyen bir hata oluştu.");
      }
    }
  }
});

// Render требует открыть порт:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
