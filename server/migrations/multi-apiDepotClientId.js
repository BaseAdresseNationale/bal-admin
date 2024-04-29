const mongoClient = require('../utils/mongo-client')

const collectionName = "partenaires-de-la-charte";

async function main() {
  await mongoClient.connect()

  const pdlcs = await mongoClient.db.collection(collectionName).find(
    {apiDepotClientId: {$ne: null}},
  ).toArray()

  for (const pdlc of pdlcs) {
    await mongoClient.db.collection(collectionName).updateOne(
      {_id: pdlc._id},
      {$set: {apiDepotClientId: [pdlc.apiDepotClientId]}},
    )
  }

  await mongoClient.disconnect()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
}).then(() => {
  process.exit(0)
})
