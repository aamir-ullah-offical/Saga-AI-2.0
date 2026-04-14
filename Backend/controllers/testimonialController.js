const Testimonial = require("../models/testimonialModel");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "testimonials",
    allowed_formats: ["jpg", "png", "jpeg", "avif"],
  },
});

const upload = multer({ storage });

// ✅ Get All Testimonials
const getAllTestimonials = asyncHandler(async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("🔥 Error fetching testimonials:", error.message);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// ✅ Get Testimonial by ID
const getTestimonialById = asyncHandler(async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json(testimonial);
  } catch (error) {
    console.error("🔥 Error fetching testimonial by ID:", error.message);
    res.status(500).json({ error: "Failed to fetch testimonial" });
  }
});

// ✅ Add Testimonial
const addTestimonial = asyncHandler(async (req, res) => {
  try {
    const { name, position, testimonialText, rating, status } = req.body;
    if (!name || !position || !testimonialText) {
      return res.status(400).json({ error: "Name, Position, and Testimonial Text are required!" });
    }
    
    const profileImage = req.file ? req.file.path : process.env.DEFAULT_PROFILE_IMAGE;
    const ratingValue = Math.min(Math.max(parseInt(rating) || 5, 1), 5);

    const newTestimonial = new Testimonial({
      name,
      position,
      testimonialText,
      rating: ratingValue,
      status: status || "active",
      profileImage,
    });

    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial added successfully!", testimonial: newTestimonial });
  } catch (error) {
    console.error("🔥 Error adding testimonial:", error.message);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

// ✅ Update Testimonial
const updateTestimonial = asyncHandler(async (req, res) => {
  try {
    const { name, position, testimonialText, rating, status } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });

    let profileImage = testimonial.profileImage;

    // ✅ Delete old image from Cloudinary if new image is uploaded
    if (req.file) {
      if (testimonial.profileImage) {
        const publicId = testimonial.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`testimonials/${publicId}`);
      }
      profileImage = req.file.path;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        testimonialText,
        rating: rating ? Math.min(Math.max(parseInt(rating), 1), 5) : testimonial.rating,
        status,
        profileImage,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Testimonial updated successfully!", testimonial: updatedTestimonial });
  } catch (error) {
    console.error("🔥 Error updating testimonial:", error.message);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

// ✅ Delete Testimonial
const deleteTestimonial = asyncHandler(async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });

    // ✅ Delete image from Cloudinary
    if (testimonial.profileImage) {
      const publicId = testimonial.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`testimonials/${publicId}`);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Testimonial deleted successfully!" });
  } catch (error) {
    console.error("🔥 Error deleting testimonial:", error.message);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// ✅ Export All Functions
module.exports = {
  getAllTestimonials,
  getTestimonialById,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  upload,
};
