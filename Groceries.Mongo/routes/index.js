var express = require("express");
var router = express.Router();
let mongoose = require("mongoose");
let Grocery = mongoose.model("Grocery");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("server works");
});

router.get("/API/Groceries", function (req, res, next) {
  Grocery.find(function (err, groceries) {
    res.json(groceries);
  });
});

router.post("/API/CreateGrocery", (req, res, next) => {
  req.body.modifiedOn = new Date();
  let grocery = new Grocery(req.body);
  grocery.save((err, rec) => {
    if (err) return next(err);
    res.json(rec);
  });
});

router.post("/API/Sync", async (req, res, next) => {
  try {
    var groceries = req.body;
    for (groc of groceries) {
      console.log(groc);
      switch (groc.action) {
        case "Delete":
          break;
        case "Add":
          console.log("add");
          groc.modifiedOn = new Date();
          var grocery = new Grocery(groc);
          await grocery.save(function (err, rec) {});
          break;
        case "Update":
          break;
        case "Nothing":
        default:
          break;
      }
    }
  } catch {
    res.send("failed");
  }

  Grocery.find(function (err, groceries) {
    res.json(groceries);
  });
});

module.exports = router;
