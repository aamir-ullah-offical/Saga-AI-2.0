const mongoose = require("mongoose");

const aiSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    useCases: {
      type: [String],
      required: [true, "Use cases are required"],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Use cases must be a non-empty array",
      },
    },
    coverage: {
      type: String,
      required: [true, "Coverage information is required"],
      trim: true,
    },
    pricing: {
      type: String,
      required: [true, "Pricing information is required"],
      trim: true,
    },
    features: {
      type: [String],
      required: [true, "Features are required"],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Features must be a non-empty array",
      },
    },
    aiImage: {
      type: String,
      required: [true, "AI Image URL is required"],
      match: [
        /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|tiff|avif))$/i,
        "Invalid image URL format",
      ],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "AI link is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^https?:\/\/.+$/, "Invalid URL format"],
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AI", aiSchema);
