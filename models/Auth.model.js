const mongoose = require("mongoose");
const authSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: Number, required: true },
  isUser: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
});

const AuthModel = mongoose.model("auth", authSchema);

module.exports = { AuthModel };
