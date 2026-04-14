const multer = require("multer");

// Allowed file types
const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/avif"];

// Use memory storage for Cloudinary or other cloud services
const storage = multer.memoryStorage();

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: JPG, JPEG, PNG, AVIF"), false);
  }
};

// Multer upload middleware (2MB file size limit)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

module.exports = upload;
