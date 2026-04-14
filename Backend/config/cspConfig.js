const helmet = require("helmet");

const cspConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // ✅ Allows inline scripts
        "'unsafe-eval'",   // ✅ Allows eval() and dynamically created scripts
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://stackpath.bootstrapcdn.com",
        "https://code.jquery.com" // ✅ Allow jQuery
      ],
      scriptSrcAttr: [
        "'unsafe-inline'", // ✅ Fixes inline event handler issues (onclick, onload, etc.)
        "'unsafe-hashes'", // ✅ Allows inline event handlers when hashed
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // ✅ Allows inline styles
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "data:",  // ✅ Fixes base64 fonts
        "https://cdnjs.cloudflare.com",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
      ],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
    },
  },
});

module.exports = cspConfig;
