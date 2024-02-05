const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const translate = require('translate-google');

const apiKey = 'api-ninjas api key'; 
const botToken = 'token'; 

console.log('Bot dixebite'); // Yeni eklenen satır

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

const startPngUrl = "https://i.pinimg.com/564x/86/f3/62/86f36292ea0e69d8b461a5b8b160c8be.jpg";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const aboutText = "Slav! Ez boteke ji aliye @horhorîk vê ji bo jêgiranan ku bi wergera kurdî hatime avakirin. Ez dikarim gotinên îlhamê pêşkêşî we bikim. Hûn dikarin fermanên jêrîn bikar bînin:\n\n" +
                    "/vebir - Ji bo lîsteya vebiran\n" +
                    "/{vebir} - jêgiranan ku bi kategoriyekî diyarî bistînin. Mînakek: /art\n\n" +
                    "Github: " + " [Çavkaniya Azad](https://github.com/horhorist/jegiran-telegram-bot)";

  bot.sendPhoto(chatId, startPngUrl, { caption: aboutText, parse_mode: "Markdown" });
});



bot.onText(/\/vebir/, (msg) => {
  const chatId = msg.chat.id;

  const categoriesList = categories.join('\n');
  const message = `<b>Vebirên ku dikarin werin hilbijartin:</b>\n${categoriesList}`;

  bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
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
