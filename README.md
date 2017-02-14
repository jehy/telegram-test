#Telegram test

[![Build Status](https://travis-ci.org/jehy/telegram-test.svg?branch=master)](https://travis-ci.org/jehy/telegram-test)

Simple module for testing telegram bots, created with `node-telegram-bot-api`
which lets you test bot's logic without using telegram API.

##Installation
```bash
npm install telegram-test
```

##Usage

###Include all necessary modules
```js
var
  TelegramTester = require('telegram-test'),
  Promise          = require('bluebird'),
  TelegramBot      = require('node-telegram-bot-api'),
  telegramBot      = new TelegramBot("sample token", {});
```

###Create a bot with any kind of logic
```js
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
```
###Write tests
(note that telegramBot is an instance of node-telegram-bot-api):
```js
describe('Telegram Update Generator', function () {
  let myBot = new TestBot(telegramBot);
  let testChat = 0;
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
```

You can also emulate selecting different actions, using data.keyboard.