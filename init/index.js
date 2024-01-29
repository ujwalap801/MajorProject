const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const { Types: { ObjectId } } = mongoose;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderweb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const ownerId = new ObjectId("65b64a1a16cf81c9b3f158e2");
 initData.data= initData.data.map((obj)=>({...obj,owner :ownerId}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
