const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

if (!url || !databaseName) {
  console.log("mongo database URL or database name not set. Check .env file.");
  return;
}

const collectionName = "guests";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let guestCollection;

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      guestCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
      resolve();
    });
  });
};

const insertOne = function (guest) {
  return new Promise((resolve, reject) => {
    guestCollection.insertOne(guest, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log("SUCCESSFULLY INSERTED A NEW DOCUMENT!");
      resolve();
    });
  });
};

const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    guestCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log(`SUCCESSFULLY FOUND ${documents.length} DOCUMENTS!`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    guestCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};

const updateOne = function (query, newGuest) {
  const newGuestQuery = {};

  if (newGuest.name) {
    newGuestQuery.name = newGuest.name;
  }
  if (newGuest.address) {
    newGuestQuery.address = newGuest.address;
  }
  return new Promise((resolve, reject) => {
    guestCollection.updateOne(
      query,
      { $set: newGuestQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found");
          reject("No Document Found");
        }
        console.log("SUCCESSFULLY UPDATED DOCUMENT!");
        resolve();
      }
    );
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    guestCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
      }
      console.log("SUCCESSFULLY DELETED DOCUMENT");
      resolve();
    });
  });
};

module.exports = { connect, insertOne, findAll, findOne, updateOne, deleteOne };
