/* eslint-disable import/no-extraneous-dependencies */

const
  Promise      = require('bluebird'),
  TelegramBot  = require('node-telegram-bot-api'),
  TelegramTest = require('../../index.js'),
  telegramBot  = new TelegramBot('sample token', {});

class TestBot {
  constructor(bot) {
    bot.onText(/\/ping/, (msg, match)=> {
      const chatId = msg.from.id;
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'ok'}]],
        }),
      };
      bot.sendMessage(chatId, 'pong', opts);
    });

    bot.onText(/\/start/, (msg, match)=> {
      const chatId = msg.from.id;
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Masha'}, {text: 'Sasha'}]],
        }),
      };
      bot.sendMessage(chatId, 'What is your name?', opts);
    });

    bot.onText(/Masha/, (msg, match)=> {
      const chatId = msg.from.id;
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Hello!'}]],
        }),
      };
      bot.sendMessage(chatId, 'Hello, Masha!', opts);
    });

    bot.onText(/Sasha/, (msg, match)=> {
      const chatId = msg.from.id;
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Hello!'}]],
        }),
      };
      bot.sendMessage(chatId, 'Hello, Sasha!', opts);
    });
  }
}

describe('Telegram Test', ()=> {
  const myBot = new TestBot(telegramBot);
  let testChat = 0;
  it('should create a message', () => {
    testChat++;
    const messageGenerator = new TelegramTest(telegramBot);
    messageGenerator.makeMessage('wazzup?', {chatId: testChat});
    return Promise.resolve();
  });

  it('should be able to talk with sample bot', () => {
    const telegramTest = new TelegramTest(telegramBot);
    testChat++;
    return telegramTest.sendUpdate(testChat, '/ping')
      .then(data=> {
        if (data.text === 'pong') {
          return telegramTest.sendUpdate(testChat, '/start');
        }
        throw new Error(`Wrong answer for ping! (was  ${data.text})`);
      })
      .then(data=> telegramTest.sendUpdate(testChat, data.keyboard[0][0].text))
      .then(data=> {
        if (data.text === 'Hello, Masha!') {
          return true;
        }
        throw new Error('Wrong greeting!');
      });
  });
});
