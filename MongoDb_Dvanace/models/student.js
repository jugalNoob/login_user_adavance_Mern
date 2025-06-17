const mongoose = require("mongoose");
const shortid = require("shortid");

require("dotenv").config();



const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hide by default when querying
    },
    date: {
      type: Date,
      default: Date.now,
    },
    shortId: {
      type: String,
      unique: true,
      default: shortid.generate,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);




// Create and export the student model
const Register  = mongoose.model("Url", studentSchema);
module.exports = Register ;



