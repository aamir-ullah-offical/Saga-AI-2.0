// controllers/emailController.js
const Email = require("../models/emailModel");

/* ===============================================================
   POST  /api/emails          (PUBLIC)
   Body: { email }
================================================================ */
exports.addEmail = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required." });

  try {
    const saved = await Email.create({ email });   // schema = { email }

    res.status(201).json({
      message: "Email saved.",
      data: saved,
    });
  } catch (err) {
    // duplicate key → already subscribed
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already exists." });

    console.error(err);
    res.status(500).json({ message: "Failed to save email." });
  }
};

/* ===============================================================
   GET   /api/emails          (PUBLIC)
   Returns an array of all saved e‑mail addresses
================================================================ */
exports.getAllEmails = async (req, res) => {
  try {
    const list = await Email.find().sort({ createdAt: -1 }); // newest first
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch emails." });
  }
};

/* ===============================================================
   DELETE  /api/emails/:id    (PUBLIC)
================================================================ */
exports.deleteEmail = async (req, res) => {
  try {
    const deleted = await Email.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Email not found." });

    res.json({ message: "Email deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deletion failed." });
  }
};
