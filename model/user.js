const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String,require: true, default: null },
  last_name: { type: String, require: true,default: null },
  email: { type: String,require: true, unique: true,immutable: true},
  password: { type: String,require: true,},
  token: { type: String },
});

mongoose.model("user", userSchema);