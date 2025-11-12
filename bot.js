const TelegramBot = require("node-telegram-bot-api");

// ✅ Берём данные из Render Environment Variables
const token = process.env.TOKEN;
const YOUR_ID = Number(process.env.YOUR_ID);
const GIRL_ID = Number(process.env.GIRL_ID);
const SECOND_ID = Number(process.env.SECOND_ID); // 🔹 для тестов

const bot = new TelegramBot(token, { polling: true });

// 🩵 Приветствие при /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Seni seviyorum kadin!💌");
});

// 🔹 Основная логика
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // === Если пишет девушка ===
  if (chatId === GIRL_ID) {
    try {
      // Отправляем тебе и тест-аккаунту
      const targets = [YOUR_ID, SECOND_ID].filter(Boolean);
      for (const target of targets) {
        if (msg.text) await bot.sendMessage(target, `💬 Kız: ${msg.text}`);
        if (msg.photo)
          await bot.sendPhoto(target, msg.photo[msg.photo.length - 1].file_id, {
            caption: msg.caption
              ? `Kız: ${msg.caption}`
              : "📸 Kız'dan fotoğraf",
          });
        if (msg.audio)
          await bot.sendAudio(target, msg.audio.file_id, {
            caption: "🎵 Kız'dan müzik",
          });
        if (msg.video)
          await bot.sendVideo(target, msg.video.file_id, {
            caption: "🎬 Kız'dan video",
          });
        if (msg.voice) await bot.sendVoice(target, msg.voice.file_id);
        if (msg.document) await bot.sendDocument(target, msg.document.file_id);
      }

      console.log("📨 Mesaj kızdan geldi, sana ve test ID'ye iletildi.");
    } catch (err) {
      console.error("🚨 Hata (kızdan gelen mesajı iletirken):", err);
    }
    return;
  }

  // === Если пишешь ты (или тест-аккаунт) ===
  if (chatId === YOUR_ID || chatId === SECOND_ID) {
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

      console.log(`✅ Mesaj kız'a gönderildi! (kimden: ${chatId})`);
    } catch (error) {
      if (error.response?.body?.description === "Bad Request: chat not found") {
        console.log("⚠️ Kız henüz bota yazmadı (chat not found).");
        bot.sendMessage(
          chatId,
          "⚠️ Kız henüz bota yazmadı, bu yüzden mesaj gönderilemiyor 💬",
        );
      } else {
        console.error("🚨 Beklenmeyen hata:", error);
        bot.sendMessage(chatId, "🚨 Beklenmeyen bir hata oluştu.");
      }
    }
  }
});
