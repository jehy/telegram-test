#Telegram test

[![Build Status](https://travis-ci.org/jehy/telegram-test.svg?branch=master)](https://travis-ci.org/jehy/telegram-test)
[![Coverage Status](https://coveralls.io/repos/github/jehy/telegram-test/badge.svg?branch=master)](https://coveralls.io/github/jehy/telegram-test?branch=master)
[![dependencies Status](https://david-dm.org/jehy/telegram-test/status.svg)](https://david-dm.org/jehy/telegram-test)
[![devDependencies Status](https://david-dm.org/jehy/telegram-test/dev-status.svg)](https://david-dm.org/jehy/telegram-test?type=dev)

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
  TelegramBot      = require('node-telegram-bot-api'),
  telegramBot      = new TelegramBot("sample token", {});
```

###Create a bot with any kind of logic
```js
class TestBot {
  constructor(bot) {
    bot.onText(/\/ping/, (msg, match)=> {
      let chatId = msg.from.id;
      let opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'ok'}]],
        }),
      };
      bot.sendMessage(chatId, 'pong', opts);
    });

    bot.onText(/\/start/, (msg, match)=> {
      let chatId = msg.from.id;
      let opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Masha'}, {text: 'Sasha'}]],
        }),
      };
      bot.sendMessage(chatId, 'What is your name?', opts);
    });

    bot.onText(/Masha/, (msg, match)=> {
      let chatId = msg.from.id;
      let opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Hello!'}]],
        }),
      };
      bot.sendMessage(chatId, 'Hello, Masha!', opts);
    });

    bot.onText(/Sasha/, (msg, match)=> {
      let chatId = msg.from.id;
      let opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [[{text: 'Hello!'}]],
        }),
      };
      bot.sendMessage(chatId, 'Hello, Sasha!', opts);
    });
  }
}
```
###Write tests
(note that telegramBot is an instance of node-telegram-bot-api):
```js
describe('Telegram Test', ()=> {
  const myBot = new TestBot(telegramBot);
  let testChat = 0;
  it('should be able to talk with sample bot', () => {
    const telegramTest = new TelegramTest(telegramBot);
    testChat++;
    return telegramTest.sendUpdate(testChat, '/ping')
      .then((data)=> {
        if (data.text === 'pong') {
          return telegramTest.sendUpdate(testChat, '/start');
        }
        throw new Error(`Wrong answer for ping! (was  ${data.text})`);
      })
      .then(data=> telegramTest.sendUpdate(testChat, data.keyboard[0][0].text))
      .then((data)=> {
        if (data.text === 'Hello, Masha!') {
          return true;
        }
        throw new Error('Wrong greeting!');
      });
  });
});
```

You can also emulate selecting different actions, using data.keyboard like this:

```js
describe('Telegram Bot tests', function () {
  let testChat=1;
  let myBot = new TestBot(telegramBot);
  let telegramTest = new TelegramTest(telegramBot);
  it('should complete a complex choise', function () {
    var myChat = testChat;
    testChat++;
    return telegramTest.sendUpdate(myChat, "/start")
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][1].text);
      })
      .then(data=> {
         if(data.text==='Final' && data.keyboard[0][0].text==='Finish')
         {
          return;
         }
         else
         {
           throw new Error('we went some other way!')
         }
      });
  });
});
```

Of cause you can also make a simple array of choices and iterate through it.