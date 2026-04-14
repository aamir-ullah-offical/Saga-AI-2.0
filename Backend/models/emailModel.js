// emailModel.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    /** subscriber’s e‑mail address only */
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
