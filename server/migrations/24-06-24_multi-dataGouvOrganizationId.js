const mongoClient = require("../utils/mongo-client");

const collectionName = "partenaires-de-la-charte";

async function main() {
  await mongoClient.connect();

  const pdlcs = await mongoClient.db
    .collection(collectionName)
    .find({ dataGouvOrganizationId: { $ne: null } })
    .toArray();

  for (const pdlc of pdlcs) {
    await mongoClient.db
      .collection(collectionName)
      .updateOne(
        { _id: pdlc._id },
        { $set: { dataGouvOrganizationId: [pdlc.dataGouvOrganizationId] } }
      );
  }

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
