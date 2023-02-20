"use strict";
const axios = require("axios").default;
const util = require("util");

// return one stock price, and update likes to db.
const fetchAndUpdateStock = async (symbol, like, ipAddr, dbClient) => {
  // const fetchAndUpdateDoc = util.promisify(dbClient.FetchAndUpdateDoc);
  try {
    // 1. fetch latest price
    const { data } = await axios.get(
      `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
    );
    console.log("stock price:", data.latestPrice);
    // 2. fetch and update likes
    let doc = await dbClient.fetchAndUpdateDoc(symbol, like, ipAddr);
    console.log("fetch db:", doc);
    return doc;
  } catch (err) {
    console.error(err);
  }
};

module.exports = (app, dbClient) => {
  app.route("/api/stock-prices").get(async (req, res, next) => {
    const stock = req.query.stock;
    const like = req.query.like;
    if (stock && stock.length == 2) {
      const [stock1, stock2] = await Promise.all([
        fetchAndUpdateStock(stock[0], like, req.ipAddr, dbClient),
        fetchAndUpdateStock(stock[1], like, req.ipAddr, dbClient),
      ]);
      // merge data;
      console.log(stock1, stock2);
    } else {
      let ret = await fetchAndUpdateStock(stock, like, req.ipAddr, dbClient);
      console.log("xxx");
    }
  });
};
