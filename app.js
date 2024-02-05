const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const translate = require('translate-google');

const apiKey = 'WW097+qJGunVDKZP7nECXw==nXafMLCSUtBBVeKU'; 
const botToken = '6686880437:AAEbrLvuOIDb_84V1XCkg5VRuHyRaK3nfCs'; 
console.log('Bot dixebite'); 

const bot = new TelegramBot(botToken, { polling: true });

const categories = [
  'age', 'alone', 'amazing', 'anger', 'architecture', 'art', 'attitude', 'beauty', 'best', 'birthday',
  'business', 'car', 'change', 'communication', 'computers', 'cool', 'courage', 'dad', 'dating', 'death',
  'design', 'dreams', 'education', 'environmental', 'equality', 'experience', 'failure', 'faith', 'family',
  'famous', 'fear', 'fitness', 'food', 'forgiveness', 'freedom', 'friendship', 'funny', 'future', 'god',
  'good', 'government', 'graduation', 'great', 'happiness', 'health', 'history', 'home', 'hope', 'humor',
  'imagination', 'inspirational', 'intelligence', 'jealousy', 'knowledge', 'leadership', 'learning', 'legal',
  'life', 'love', 'marriage', 'medical', 'men', 'mom', 'money', 'morning', 'movies', 'success'
];


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const aboutText = "Slav! Ez boteke ji aliye @horhorik vê ji bo jêgiranan ku bi wergera kurdî hatime avakirin.Ez dikarim gotinên îlhamê pêşkêşî we bikim. \n\n Hûn dikarin fermanên jêrîn bikar bînin: \n\n/vebir: ji bo lîsteya vebiran. \n/{VebiraKuTuHilbijart}: jêgirana ku hûn dixwazin.\n\nMînakek: /love an jî /art";

  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Tirşik', url: 'https://tirsik.net/niviskar.php?trskvn=1394301618&m=kiye' },
          { text: 'github', url: 'https://github.com/Horhorist/jegiran-telegram-bot' }
        ]
      ]
    }
  };
  bot.sendMessage(chatId, aboutText, keyboard);
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
});



bot.onText(/\/vebir/, (msg) => {
  const chatId = msg.chat.id;

  const categoriesList = categories.join('\n');
  const message = `<b>Vebirên ku dikarin werin hilbijartin:</b>\n${categoriesList}`;

  bot.sendMessage(chatId, message, keyboard, { parse_mode: 'HTML' });
});

bot.onText(/\/(\w+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const category = match[1].toLowerCase();

  if (!categories.includes(category) && category !== 'start' && category !== 'vebir') {
    bot.sendMessage(chatId, 'Te fermanekî nederbasdar daxwaz kir.');
    return;
  }

  request.get({
    url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
    headers: {
      'X-Api-Key': apiKey
    },
  }, async function (error, response, body) {
    if (error) return bot.sendMessage(chatId, 'Nederbasdar e');
    else if (response.statusCode != 200) return bot.sendMessage(chatId, 'Hata: ' + response.statusCode);
    else {
      const quote = JSON.parse(body);

      if (quote[0] && quote[0].quote) {
        const originalText = quote[0].quote;
        const translationMessage = await bot.sendMessage(chatId, 'Jêgiran tê wergerandin...');
        const translatedQuote = await translate(originalText, { to: 'ku' });
        const formattedMessage = `<b>Bi kurdî:</b>\n${translatedQuote}\n\n<b>Bi ingîlîzî:</b>\n${originalText}`;
        
        bot.deleteMessage(chatId, translationMessage.message_id);
        bot.sendMessage(chatId, formattedMessage, { parse_mode: 'HTML' });
      } else if (category !== 'start' && category !== 'vebir') {
        bot.sendMessage(chatId, 'Li ser vebira tu hilbijartî tiştek tune ye. Ji kerema xwe vebirên din hilbijêre.');
      }
    }
  });
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
