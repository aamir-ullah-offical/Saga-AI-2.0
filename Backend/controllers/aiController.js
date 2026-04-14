const AI = require("../models/aiModels");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinaryConfig");

// Multer Storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  },
});

// Cloudinary Upload Function
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ai_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ Get All AIs
exports.getAllAIs = asyncHandler(async (req, res) => {
  try {
    const aiList = await AI.find();
    res.status(200).json(aiList);
  } catch (error) {
    console.error("🔥 Error fetching AIs:", error.message);
    res.status(500).json({ error: "Failed to fetch AI data" });
  }
});

// ✅ Get AI by ID
exports.getAIById = asyncHandler(async (req, res) => {
  try {
    const ai = await AI.findById(req.params.id);
    if (!ai) return res.status(404).json({ error: "AI not found" });
    res.status(200).json(ai);
  } catch (error) {
    console.error("🔥 Error fetching AI by ID:", error.message);
    res.status(500).json({ error: "Failed to fetch AI data" });
  }
});

// ✅ Add AI
exports.addAI = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      useCases,
      coverage,
      pricing,
      features,
      link,
      trending,
    } = req.body;
    let aiImage = null;

    if (req.file) {
      aiImage = await uploadToCloudinary(req.file.buffer);
    }

    const newAI = await AI.create({
      title,
      shortDescription,
      useCases: useCases?.split(",") || [],
      coverage,
      pricing,
      features: features?.split(",") || [],
      aiImage,
      link,
      trending: trending ?? false, // Optional trending flag
    });

    res.status(201).json(newAI);
  } catch (error) {
    console.error("🔥 Error adding AI:", error.message);
    res.status(500).json({ error: "Failed to add AI entry" });
  }
});

// ✅ Update AI
exports.updateAI = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      useCases,
      coverage,
      pricing,
      features,
      link,
      trending,
    } = req.body;
    let aiImage;

    if (req.file) {
      aiImage = await uploadToCloudinary(req.file.buffer);
    }

    const updatedAI = await AI.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        useCases: useCases?.split(",") || [],
        coverage,
        pricing,
        features: features?.split(",") || [],
        ...(aiImage && { aiImage }),
        link,
        ...(typeof trending !== "undefined" && { trending }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedAI) return res.status(404).json({ error: "AI not found" });

    res.status(200).json(updatedAI);
  } catch (error) {
    console.error("🔥 Error updating AI:", error.message);
    res.status(500).json({ error: "Failed to update AI entry" });
  }
});

// ✅ Delete AI
exports.deleteAI = asyncHandler(async (req, res) => {
  try {
    const deletedAI = await AI.findByIdAndDelete(req.params.id);
    if (!deletedAI) return res.status(404).json({ error: "AI not found" });
    res.status(200).json({ message: "AI entry deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting AI:", error.message);
    res.status(500).json({ error: "Failed to delete AI entry" });
  }
});

// ✅ Patch Trending Field Only
exports.patchTrendingStatus = asyncHandler(async (req, res) => {
  try {
    const { trending } = req.body;

    if (typeof trending !== "boolean") {
      return res
        .status(400)
        .json({ error: "`trending` must be a boolean (true/false)" });
    }

    const updatedAI = await AI.findByIdAndUpdate(
      req.params.id,
      { trending },
      { new: true, runValidators: true }
    );

    if (!updatedAI) return res.status(404).json({ error: "AI not found" });

    res.status(200).json({
      message: "Trending status updated successfully",
      ai: updatedAI,
    });
  } catch (error) {
    console.error("🔥 Error updating trending status:", error.message);
    res.status(500).json({ error: "Failed to update trending status" });
  }
});

// ✅ Get AI Statistics
exports.getAIsStatistics = asyncHandler(async (req, res) => {
  try {
    const totalAIs = await AI.countDocuments();

    const trendingAIs = await AI.countDocuments({ trending: true });

    const useCaseStats = await AI.aggregate([
      { $unwind: "$useCases" },
      {
        $group: {
          _id: "$useCases",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalUseCases = useCaseStats.reduce(
      (sum, item) => sum + item.count,
      0
    );

    res.status(200).json({
      totalAIs,
      trendingAIs, // ✅ added
      totalUseCases,
      useCaseStats,
    });
  } catch (error) {
    console.error("🔥 Error fetching AI statistics:", error.message);
    res.status(500).json({ error: "Failed to fetch AI statistics" });
  }
});

// ✅ Middleware to handle image upload
exports.uploadAIImage = upload.single("aiImage");
