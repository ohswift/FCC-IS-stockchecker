async function main(callback) {
  const mongoose = require("mongoose");
  console.log("[DB] begin connect db successfully.");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const Model = mongoose.model(
      "stocks",
      new mongoose.Schema({
        symbol: { type: String, required: true },
        likes: { type: Number },
        ips: { type: Array },
        price: { type: Number }, // not used now...
      })
    );

    console.log("[DB] connect db successfully.");

    const fetchAndUpdateDoc = (symbol, like, ipAddr) => {
      return new Promise((resolve, reject) => {
        Model.findOne({ symbol }, (err, doc) => {
          console.log("findOne", err, doc);
          if (err) {
            return reject(err);
          }
          if (!doc) {
            // not found, create a new one
            console.log("create a new stock");
            doc = new Model({
              symbol,
              likes: 0,
              ips: [],
            });
          }
          if (like && !doc.ips.includes(ipAddr)) {
            // need to update likes
            doc.likes += 1;
            doc.ips = [...doc.ips, ipAddr];
          }
          doc.save((err1, doc1) => {
            console.log("doc.save", err1, doc1);
            if (err1) return reject(err1);
            resolve(doc1);
          });
        });
      });
    };
    callback({
      fetchAndUpdateDoc,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
