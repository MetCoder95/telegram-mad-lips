const Telegraf = require("telegraf");
const Router = require("telegraf/router");
const Extra = require("telegraf/extra");
const Session = require("telegraf/session");

const markup = Extra.HTML().markup(
  m =>
    m.inlineKeyboard([
      m.callbackButton("Play!", "play"),
      m.callbackButton("Know about me", "about")
    ]),
  { columns: 2 }
);

const madlibs = new Router(({ callbackQuery }) => {
  const { data } = callbackQuery;

  if (!data) return;

  console.log(data);
  const parts = data.split(":");

  return {
    route: parts[0],
    state: {
      text: "Hello!"
    }
  };
});

madlibs.on("play", ctx => {
  console.log(ctx);
  console.log("Time to play!");
  return ctx
    .answerCbQuery("Time to play!", true)
    .then(() => ctx.editMessageText("Wujuuu!"));
});

madlibs.on("about", ctx => {
  console.log(ctx);
  console.log("This is me!");
  return ctx
    .answerCbQuery("This is me!", true)
    .then(() => ctx.editMessageText("Did you know me?"));
});

const bot = new Telegraf("714009104:AAFCVm45GPIa8p0QiAZzeWRk9HtpWnzcGFk");

bot.use(Session({ ttl: 10 }));
bot.start(ctx => {
  return ctx.reply("Welcome to madlibs!", markup);
});

bot.on("callback_query", madlibs);
bot.startPolling();
