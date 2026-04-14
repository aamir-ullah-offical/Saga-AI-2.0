const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    testimonialText: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: true,
      default: "default-profile.png",
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(v);
        },
        message: "Invalid image URL format",
      },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Add an index for faster retrieval
testimonialSchema.index({ name: 1, status: 1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
