const mongoClient = require('../utils/mongo-client')
const EventsService = require('../lib/events/service')
const events = require('./data/events.json')

const distinctTypes = events.reduce((acc, event) => {
    if (!acc.includes(event.type)) {
      acc.push(event.type)
    }
    return acc
  }, [])

  const distinctTargets = events.reduce((acc, event) => {
    if (!acc.includes(event.target)) {
      acc.push(event.target)
    }
    return acc
  }, [])

  const distinctTags = events.reduce((acc, event) => {
    for (const tag of event.tags) {
      if (!acc.includes(tag)) {
        acc.push(tag)
      }
    }

    return acc
  }, [])

  console.log(distinctTags)

console.log(distinctTypes)

console.log(distinctTargets)

async function main() {
//   await mongoClient.connect()



//   for await (const event of events) {
//     await EventsService.createOne(event)
//   }

//   await mongoClient.disconnect()
}

main().catch(error => {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}).then(() => {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0)
})
