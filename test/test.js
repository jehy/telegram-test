'use strict';
var
  TelegramTest = require('../script.es2015.js'),
  Promise      = require('bluebird'),
  TelegramBot  = require('node-telegram-bot-api'),
  telegramBot  = new TelegramBot("sample token", {});


let TestBot = function (bot) {

  bot.onText(/\/ping/, function (msg, match) {
    let chatId = msg.from.id;
    let opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [[{text: "ok 1"}]]
      })
    };
    bot.sendMessage(chatId, "pong", opts);
  });

  bot.onText(/whoami/, function (msg, match) {
    let chatId = msg.from.id;
    let opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [[{text: "ok 2"}]]
      })
    };
    bot.sendMessage(chatId, "test", opts);
  });
};


describe('Telegram Update Generator', function () {
  let myBot = new TestBot(telegramBot);
  let testChat = 0;
  it('should create a message', function () {
    testChat++;
    let messageGenerator = new TelegramTest(telegramBot);
    messageGenerator.makeMessage("wazzup?", {chatId: testChat});
    return Promise.resolve();
  });


  it('should be able to talk with sample bot', function () {
    let telegramTest = new TelegramTest(telegramBot);
    testChat++;
    return telegramTest.sendUpdate(testChat, "/ping")
      .then(data=> {
        if (data.keyboard[0][0].text === 'ok 1')
          return telegramTest.sendUpdate(testChat, "whoami");
        else throw new Error('Wrong keyboard key for ping! (was ' + data.keyboard[0][0].text + ')')
      })
      .then(data=> {
        if (data.keyboard[0][0].text === 'ok 2')
          return true;
        else throw new Error('Wrong keyboard key for whoami! (was ' + data.keyboard[0][0].text + ')')
      });
  });
});