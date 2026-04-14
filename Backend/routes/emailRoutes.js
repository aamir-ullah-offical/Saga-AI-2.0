// routes/emailRoutes.js
const express = require("express");
const {
  addEmail,
  deleteEmail,
  getAllEmails,      // 👈 import the new controller
} = require("../controllers/emailController");

const router = express.Router();

/* PUBLIC */
router.post("/emails", addEmail);          // save address
router.get("/emails", getAllEmails);       // fetch all addresses
router.delete("/emails/:id", deleteEmail); // remove address by id

module.exports = router;
