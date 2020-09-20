const express = require("express");
const cors = require("cors");
const { response } = require("express");
const bodyParser = require("body-parser");
const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId, ObjectID } = require("mongodb");
dataAccessLayer.connect();
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/api/guests", async (request, response) => {
  const guests = await dataAccessLayer.findAll();
  response.send(guests);
});

app.get("/api/guests/:id", async (request, response) => {
  const guestId = request.params.id;
  if (!ObjectID.isValid(guestId)) {
    response.status(400).send(`Guest with ID ${guestId} not found!`);
    return;
  }
  const guestQuery = {
    _id: new ObjectId(guestId),
  };
  let guest;

  try {
    guest = await dataAccessLayer.findOne(guestQuery);
  } catch (error) {
    response.status(404).send(`Guest with ID ${guestId} not found!`);
  }
  response.send(guest);
});

// need name, and address

app.post("/api/guests", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.address) {
    response.send("Bad Request. Validation Error. Missing name or address.");
    return;
  }
  if (typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of the type string.");
    return;
  }
  if (typeof body.address !== "string") {
    response
      .status(400)
      .send("The address parameter must be of the type string.");
    return;
  }
  await dataAccessLayer.insertOne(body);

  response.send();
});

app.put("/api/guests/:id", async (request, response) => {
  const guestId = request.params.id;
  const body = request.body;
  if (!ObjectID.isValid(guestId)) {
    response.status(400).send(`Guest ID ${guestId} cannot be found.`);
  }
  const guestQuery = {
    _id: new ObjectId(guestId),
  };
  try {
    await dataAccessLayer.updateOne(guestQuery, body);
  } catch (error) {
    response.status(404).send(`Guest with ${guestId} not found!`);
    return;
  }
  response.send();
});

app.delete("/api/guests/:id", async (request, response) => {
  const guestId = request.params.id;
  if (!ObjectID.isValid(guestId)) {
    response.status(400).send(`Guest ID ${guestId} cannot be found.`);
    return;
  }
  const guestQuery = {
    _id: new ObjectId(guestId),
  };
  try {
    await dataAccessLayer.deleteOne(guestQuery);
  } catch (error) {
    response.status(404).send(`Guest with ID ${guestId} not found!`);
    return;
  }

  response.send();
});

const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("Wedding API Server Started!");
});
