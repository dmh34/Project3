const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String, require: true
    },
    salt: {
        type: String, require: true
    },
    hash: {
        type: String, require: true
    },
    instructor: {
        type: Boolean, require: true
    }


});

const User = mongoose.model("User", userSchema);

module.exports = User;