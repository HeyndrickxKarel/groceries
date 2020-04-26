var mongoose = require("mongoose");

var GrocerySchema = new mongoose.Schema({
  description: String,
  checked: Boolean,
  modifiedOn: Date,
});

mongoose.model("Grocery", GrocerySchema);
