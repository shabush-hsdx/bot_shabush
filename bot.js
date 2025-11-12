const TelegramBot = require("node-telegram-bot-api");

// 🔑 токен твоего бота
const token = "8284631657:AAFMFRSeIq8FWUhbn65LK8crLZydm1ftqTU";
const bot = new TelegramBot(token, { polling: true });

// 🔹 твой ID (ты)
const YOUR_ID = 408986286;

// 🔹 ID девушки (узнаешь, когда она напишет боту)
const GIRL_ID = 7481202119;

// 🩵 Приветствие при /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Seni seviyorum kadin!💌");
});

// 🔹 Основная логика
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // === Если пишет девушка ===
  if (chatId === GIRL_ID) {
    // Отправляем тебе то, что она прислала
    try {
      if (msg.text) await bot.sendMessage(YOUR_ID, `💬 Kız: ${msg.text}`);
      if (msg.photo)
        await bot.sendPhoto(YOUR_ID, msg.photo[msg.photo.length - 1].file_id, {
          caption: msg.caption ? `Kız: ${msg.caption}` : "📸 Kız'dan fotoğraf",
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

      console.log("📨 Mesaj kızdan geldi, sana iletildi.");
    } catch (err) {
      console.error("🚨 Hata (kızdan gelen mesajı iletirken):", err);
    }
    return;
  }

  // === Если пишешь ты ===
  if (chatId === YOUR_ID) {
    try {
      if (msg.text) await bot.sendMessage(GIRL_ID, msg.text);
      if (msg.photo)
        await bot.sendPhoto(GIRL_ID, msg.photo[msg.photo.length - 1].file_id, {
          caption: msg.caption,
        });
      if (msg.audio)
        await bot.sendAudio(GIRL_ID, msg.audio.file_id, {
          caption: msg.caption,
        });
      if (msg.video)
        await bot.sendVideo(GIRL_ID, msg.video.file_id, {
          caption: msg.caption,
        });
      if (msg.voice) await bot.sendVoice(GIRL_ID, msg.voice.file_id);
      if (msg.document) await bot.sendDocument(GIRL_ID, msg.document.file_id);

      console.log("✅ Mesaj kıza gönderildi!");
    } catch (error) {
      if (error.response?.body?.description === "Bad Request: chat not found") {
        console.log("⚠️ Kız henüz bota yazmadı (chat not found).");
        bot.sendMessage(
          YOUR_ID,
          "⚠️ Kız henüz bota yazmadı, bu yüzden mesaj gönderilemiyor 💬",
        );
      } else {
        console.error("🚨 Beklenmeyen hata:", error);
        bot.sendMessage(YOUR_ID, "🚨 Beklenmeyen bir hata oluştu.");
      }
    }
  }
});
