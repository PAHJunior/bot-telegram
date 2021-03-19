require('dotenv').config()
const { Telegraf, Scenes, session } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
let n1, n2

const initmensage = (ctx) => {
  ctx.reply(
    `
To calculate two numbers, write /calculate
To know my contact, write /contact
`
  )
}

const Calculate = new Scenes.WizardScene(
  'CALCULATE_TWO_NUMBERS',
  (ctx) => {
    ctx.reply('Send your first number:')
    return ctx.wizard.next()
  },
  (ctx) => {
    try {
      console.log(!Number.isInteger(Number.parseInt(ctx.message.text)))
      if (!Number.isInteger(Number.parseInt(ctx.message.text)))
        throw new Error('Number invalid')
      n1 = Number.parseInt(ctx.message.text)

      ctx.reply('Send your second number:')
      return ctx.wizard.next()
    } catch (error) {
      console.log(error)
      ctx.reply(`Number invalid ❌ - try again`)
      return ctx.scene.reenter()
    }
  },
  async (ctx) => {
    try {
      console.log(!Number.isInteger(Number.parseInt(ctx.message.text)))
      if (!Number.isInteger(Number.parseInt(ctx.message.text)))
        throw new Error('Number invalid')
      n2 = Number.parseInt(ctx.message.text)

      await ctx.reply(`${n1} + ${n2} = ${n1 + n2}`)
      await ctx.reply(`${n1} - ${n2} = ${n1 - n2}`)
      await ctx.reply(`${n1} * ${n2} = ${n1 * n2}`)
      await ctx.reply(`${n1} / ${n2} = ${n1 / n2}`)
      await ctx.reply('👍')

      return ctx.scene.leave()
    } catch (error) {
      console.log(error)
      await ctx.reply(`Number invalid ❌ - try again`)
      return ctx.wizard.reenter()
    }
  }
)

const stage = new Scenes.Stage([Calculate])
bot.use(session())
bot.use(stage.middleware())
bot.start((ctx) => {
  initmensage(ctx)
})

bot.command('calculate', Scenes.Stage.enter('CALCULATE_TWO_NUMBERS'))
bot.command('contact', async (ctx) => {
  await ctx.reply('--------------------------------------')
  await ctx.reply('by: PAHJunior')
  await ctx.reply('--------------------------------------')
  await ctx.reply('My Github: https://github.com/pahjunior')
  await ctx.reply('Linkedin: https://www.linkedin.com/in/pahjunior')
  await ctx.reply('--------------------------------------')
  await ctx.reply('Repository: https://github.com/PAHJunior/bot-telegram')
  await ctx.reply('--------------------------------------')
  return ctx.scene.leave()
})

const startBot = async () => {
  try {
    await bot.launch({
      webhook: {
        domain: process.env.BOT_URL,
        // domain: 'https://---.localtunnel.me',
        port: process.env.PORT || 3000
      }
    })
    console.log('Bot started successfully')
  } catch (error) {
    console.error(error)
  }
}

startBot()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
