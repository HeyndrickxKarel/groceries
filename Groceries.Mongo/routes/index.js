var express = require("express");
var router = express.Router();
let mongoose = require("mongoose");
let Grocery = mongoose.model("Grocery");

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.send("server works");
// });

router.get("/api/groceries", function (req, res, next) {
  Grocery.find(function (err, groceries) {
    res.json(groceries);
  });
});

// router.post("/API/CreateGrocery", (req, res, next) => {
//   req.body.modifiedOn = new Date();
//   let grocery = new Grocery(req.body);
//   grocery.save((err, rec) => {
//     if (err) return next(err);
//     res.json(rec);
//   });
// });

router.post("/api/clear", async (req, res, next) => {
  await Grocery.remove({});
  res.send("Cleared");
});

router.post("/api/sync", async (req, res, next) => {
  try {
    var groceries = req.body;
    for (groc of groceries) {
      switch (groc.action) {
        case "delete":
          await Grocery.find({ _id: groc._id }).remove();
          break;
        case "add":
          groc.modifiedOn = new Date();
          var grocery = new Grocery(groc);
          await grocery.save();
          break;
        case "update":
          await Grocery.findByIdAndUpdate(groc._id, {
            checked: groc.checked,
            description: groc.description,
          });
          break;
        case "nothing":
        default:
          break;
      }
    }
  } catch {
    res.send("Failed");
  }

  const newGroceries = await Grocery.find();
  res.json(newGroceries);
});

module.exports = router;
