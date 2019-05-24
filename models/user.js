var mongoose = require("mongoose");
var psptmngs = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(psptmngs);

module.exports = mongoose.model("User", userSchema);
