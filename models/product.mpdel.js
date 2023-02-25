const mongoose = require("mongoose");
const prodSchema = mongoose.Schema({
  url: { type: String },
  price: { type: Number },
  dPrice: { type: Number },
  brand: { type: String },
  name: { type: String },
});

const ProdModel = mongoose.model("prod", prodSchema);

module.exports = { ProdModel };
