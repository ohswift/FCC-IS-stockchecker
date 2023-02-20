const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let last_likes = 0;
suite("Functional Tests", function () {
  suite("API Tests", function () {
    test("#1 1 stock without like", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(res.body.stockData.likes);
          assert.isNumber(res.body.stockData.price);
          done();
        });
    });
    test("#2 1 stock with like", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(res.body.stockData.likes);
          last_likes = res.body.stockData.likes;
          assert.isNumber(res.body.stockData.price);
          done();
        });
    });
    test("#3 1 stock with like with same ip", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(res.body.stockData.likes);
          assert.isNumber(res.body.stockData.price);
          assert.equal(res.body.stockData.likes, last_likes);
          done();
        });
    });
    test("#4 2 stock", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["GOOG", "MSFT"] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
    });
    test("#5 2 stock with likes", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["GOOG", "MSFT"], like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
    });
  });
});
