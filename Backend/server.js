// ─────────────────── existing imports ───────────────────
const express        = require("express");
const mongoose       = require("mongoose");
const dotenv         = require("dotenv");
const cors           = require("cors");
const rateLimit      = require("express-rate-limit");
const cloudinary     = require("cloudinary").v2;
const swaggerJSDoc   = require("swagger-jsdoc");
const swaggerUi      = require("swagger-ui-express");
const path           = require("path");

// Load environment variables
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// CSP middleware
const cspConfig = require("./config/cspConfig");

// ───────── Cloudinary ─────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// ───────── Global middleware ─────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cspConfig);

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  })
);

// (optional) rate‑limiting …
// const limiter = rateLimit({...});
// app.use(limiter);

// ───────── Swagger Docs ─────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "SagaAI API", version: "1.0.0", description: "API for SagaAI" },
    servers: [{ url: process.env.BASE_URL || `http://localhost:${PORT}/api` }],
  },
  apis: ["./routes/*.js"],
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// ───────── API routes ─────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/ai",           require("./routes/aiRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api", require("./routes/emailRoutes"));


// ───────── Serve React builds (production) ─────────
if (process.env.NODE_ENV === "production") {
  const rootDir   = path.join(__dirname, "..");           // Saga-AI root
  const frontDist = path.join(rootDir, "frontend", "dist");
  const adminDist = path.join(rootDir, "admin", "dist");

  // static files
  app.use(express.static(frontDist));
  app.use("/admin", express.static(adminDist));

  // SPA fallback for admin
  app.get("/admin/*", (_, res) =>
    res.sendFile(path.join(adminDist, "index.html"))
  );

  // SPA fallback for frontend
  app.get("*", (_, res) =>
    res.sendFile(path.join(frontDist, "index.html"))
  );
}

// ───────── Database & server start ─────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

    // graceful shutdown
    const shut = async (sig) => {
      console.log(`🔻 ${sig} received. Closing server...`);
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    };
    process.on("SIGINT", shut);
    process.on("SIGTERM", shut);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};
connectDB();

// ───────── Global error handlers ─────────
app.use((err, _req, res, _next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
