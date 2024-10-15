const mongoClient = require("../utils/mongo-client");

const collectionName = "bal-widget";

async function main() {
  await mongoClient.connect();

  const config = await mongoClient.db.collection(collectionName).findOne();
  const newOutdatedHarvestSources = [];

  for (const orgaId of config?.communes?.outdatedHarvestSources) {
    const [, id] = orgaId.split(/-(.*)/s);
    newOutdatedHarvestSources.push(id.substring(0, 24));
  }

  await mongoClient.db
    .collection(collectionName)
    .updateOne(
      { _id: config._id },
      { $set: { "communes.outdatedHarvestSources": newOutdatedHarvestSources } }
    );
  await mongoClient.disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
