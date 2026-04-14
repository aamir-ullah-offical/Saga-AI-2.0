const express = require("express");
const {
  getAllTestimonials,
  getTestimonialById,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  upload, // Multer Upload Middleware from Controller
} = require("../controllers/testimonialController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: API for managing testimonials
 */

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Retrieve all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: A list of testimonials.
 */
router.get("/", getAllTestimonials);

/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Retrieve a testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial data.
 *       404:
 *         description: Testimonial not found.
 */
router.get("/:id", getTestimonialById);

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               testimonialText:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testimonial created successfully.
 *       400:
 *         description: Invalid input or missing fields.
 */
router.post("/", upload.single("profileImage"), addTestimonial);

/**
 * @swagger
 * /testimonials/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               testimonialText:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial updated successfully.
 *       404:
 *         description: Testimonial not found.
 */
router.put("/:id", upload.single("profileImage"), updateTestimonial);

/**
 * @swagger
 * /testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully.
 *       404:
 *         description: Testimonial not found.
 */
router.delete("/:id", deleteTestimonial);

module.exports = router;
