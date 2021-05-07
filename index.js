require('dotenv').config();
const path = require('path');

const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const browserObject = require('./browser');
const scraperController = require('./pageController');
let browserInstance = browserObject.startBrowser();

bot.on('message', async msg => {
    if (msg.text.startsWith('http://loveread.ec/read_book.php?id=')) {
        await bot.sendMessage(msg.from.id, 'Начинаю загрузку книги⏳');
        const bookName = await scraperController(browserInstance, msg.text);
        await bot.sendDocument(msg.from.id, path.resolve('./', `${bookName}.txt`));
    } else {
        await bot.sendMessage(msg.from.id, 'Неправильная ссылка🙈');
    }
});