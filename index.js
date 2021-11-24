const { Telegraf } = require('telegraf');
const config = require('config');

const TOKEN = config.get('token');
const bot = new Telegraf(TOKEN);
const { saysSchedule } = require('./saysSchedule');

const HELLO_MESSAGE =
  "Привіт! Я бот-помічник, який розкаже про всі доступні заняття зі свінгових танців. " +
  "Вибери напрямок, який тебе цікавить:";

const DAY_MESSAGE = "Вибери день, який тебе цікавить:";

const danceTypeActions = ['Lindy Hop', 'Solo jazz'];
const dayActions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
let danceInfo = new Map();

const handleStart = (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, HELLO_MESSAGE, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⭐️ Lindy hop', callback_data: danceTypeActions[0] },
          { text: '⭐️ Solo jazz', callback_data: danceTypeActions[1] }
        ]
      ]
    }
  });
}

const handleDanceType = (ctx) => {
  danceInfo.set('danceType', ctx.update.callback_query.data);
  bot.telegram.sendMessage(ctx.chat.id, DAY_MESSAGE, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Понеділок', callback_data: dayActions[0] },
          { text: 'Вівторок', callback_data: dayActions[1] },
          { text: 'Середа', callback_data: dayActions[2] },
        ],
        [
          { text: 'Четверг', callback_data: dayActions[3] },
          { text: `П'ятниця`, callback_data: dayActions[4] },
          { text: 'Субота', callback_data: dayActions[5] },
          { text: 'Неділя', callback_data: dayActions[6] }
        ]
      ]
    }
  });
}

const handleDay = (ctx) => {
  danceInfo.set('day', ctx.update.callback_query.data);
  saysSchedule(ctx, danceInfo);
}


bot.start(handleStart);

danceTypeActions.forEach((action) => {
  bot.action(action, handleDanceType);
})

dayActions.forEach((action) => {
  bot.action(action, handleDay);
})

bot.launch();
