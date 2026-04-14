const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS usage
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Adds security headers
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Restricts access
app.use(express.static(path.join(__dirname, "public")));

// Rate Limiting (prevents abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SagaAI API",
      version: "1.0.0",
      description: "API for managing AI platform data",
    },
    servers: [{ url: process.env.BASE_URL || `http://localhost:${PORT}/api` }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// Database Connection with Retry Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Start Server after DB is connected
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    setTimeout(connectDB, 5000); // Retry connection after 5 sec
  }
};
connectDB();

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Uncaught Exception and Unhandled Promise Rejection Handling
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});




======================================

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // CORS policy
app.use(express.static(path.join(__dirname, "public")));

// Rate Limiting (prevents abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Swagger API Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SagaAI API",
      version: "1.0.0",
      description: "API for managing AI platform data",
    },
    servers: [{ url: process.env.BASE_URL || `http://localhost:${PORT}/api` }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected");

    // Start Server after DB is connected
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    process.on("SIGINT", async () => {
      console.log("🔻 Shutting down...");
      await mongoose.connection.close();
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    });

    process.on("SIGTERM", async () => {
      console.log("🔻 Termination signal received...");
      await mongoose.connection.close();
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

connectDB();

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Handle Uncaught Exceptions & Unhandled Promise Rejections
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});









// ========================================

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import CSP Config
const cspConfig = require("./config/cspConfig");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Middleware
app.use(express.json({ limit: "10mb" })); // Prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply CSP Security Config
app.use(cspConfig);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true, // Allow credentials for secure cookies
  })
);

// Serve Static Files
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
console.log(`✅ Serving static files from: ${staticPath}`);

// Rate Limiting (prevents abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit requests per IP
  message: { success: false, error: "Too many requests, please try again later." },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter);

// Swagger API Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SagaAI API",
      version: "1.0.0",
      description: "API for managing AI platform data",
    },
    servers: [{ url: process.env.BASE_URL || `http://localhost:${PORT}/api` }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Start Server after DB is connected
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    const shutdownHandler = async (signal) => {
      console.log(`🔻 Received ${signal}, shutting down...`);
      await mongoose.connection.close();
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdownHandler);
    process.on("SIGTERM", shutdownHandler);

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

connectDB();

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Handle Uncaught Exceptions & Unhandled Promise Rejections
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

