const mongoClient = require("../utils/mongo-client");

const collectionName = "partenaires-de-la-charte";

async function main() {
  await mongoClient.connect();

  await mongoClient.db.collection(collectionName).updateMany(
    { dataGouvOrganizationId: [""] },
    {
      $set: {
        dataGouvOrganizationId: [],
      },
    }
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
