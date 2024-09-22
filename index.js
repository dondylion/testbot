const TelegramApi = require('node-telegram-bot-api');
const token = '8037636992:AAEylBMKbT2b1b7Em9-6dhEFHMlf7897Kos';
const {buttons, tryAgain} = require('./options.js');

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю число от 0 до 9, а ты должен его угадать`);
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Выбери число!`, buttons)
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Играть'},
    ])
    
    bot.on('message', async (msg) => {
        const {text} = msg;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAALLDmbwJMtE3wjVhusox5AIeD2Vc3NsAAJpTAACTPw5S-9ViQryMb_FNgQ')
            return bot.sendMessage(chatId, `Добро пожаловать!`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}?`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Я вас не понимаю`);
    })

    bot.on('callback_query', async (msg) => {
        const {data} = msg;
        const chatId = msg.message.chat.id;

        if (data == '/again') {
            return startGame(chatId);
        }

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, `Верно, это было число ${chats[chatId]}!`, tryAgain);
        } else {
            await bot.sendMessage(chatId, `Не угадал, это было чило ${chats[chatId]}`, tryAgain);
        }
    })
}

start();