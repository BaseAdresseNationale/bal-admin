const mongoClient = require('../utils/mongo-client')
const EventsService = require('../lib/events/service')
const events = require('./data/events.json')

async function main() {
  await mongoClient.connect()

  for await (const event of events) {
    await EventsService.createOne({
      ...event,
      isSubscriptionClosed: !!event.isSubscriptionClosed,
    })
  }

  await mongoClient.disconnect()
}

main().catch(error => {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}).then(() => {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0)
})
