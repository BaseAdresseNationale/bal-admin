const mongoClient = require('../utils/mongo-client')
const EventsService = require('../lib/events/service')
const events = require('./data/events.json')

async function main() {
  await mongoClient.connect()

  for await (const event of events) {
    if (event.type === "adresselab" || event.type === "adresse-region") {
      continue
    }
    await EventsService.createOne({
      ...event,
      isSubscriptionClosed: !!event.isSubscriptionClosed,
    })
  }

  await mongoClient.disconnect()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
}).then(() => {
  process.exit(0)
})
