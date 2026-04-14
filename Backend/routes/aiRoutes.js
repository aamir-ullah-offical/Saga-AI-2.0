const express = require("express");
const {
  getAllAIs,
  getAIById,
  addAI,
  updateAI,
  deleteAI,
  getAIsStatistics,
  patchTrendingStatus,
} = require("../controllers/aiController");
const upload = require("../middleware/multerConfig");

const router = express.Router();

/**
 * @swagger
 * /ai/statistics:
 *   get:
 *     summary: Get AI usage statistics
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: Returns statistics of AI use cases.
 */
router.get("/statistics", getAIsStatistics);

/**
 * @swagger
 * /ai:
 *   get:
 *     summary: Retrieve all AI data
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: List of AI data.
 */
router.get("/", getAllAIs);

/**
 * @swagger
 * /ai:
 *   post:
 *     summary: Add a new AI entry with an image
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - useCases
 *               - coverage
 *               - pricing
 *               - features
 *               - aiImage
 *               - link
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               useCases:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverage:
 *                 type: string
 *               pricing:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               aiImage:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               trending:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: AI entry created successfully.
 *       400:
 *         description: Invalid request body.
 */
router.post("/", upload.single("aiImage"), addAI);

/**
 * @swagger
 * /ai/{id}:
 *   get:
 *     summary: Get a specific AI by ID
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: AI entry ID
 *     responses:
 *       200:
 *         description: AI data retrieved successfully.
 *       404:
 *         description: AI not found.
 */
router.get("/:id", getAIById);

/**
 * @swagger
 * /ai/{id}:
 *   put:
 *     summary: Update an existing AI entry
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: AI entry ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               useCases:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverage:
 *                 type: string
 *               pricing:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               aiImage:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               trending:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: AI entry updated successfully.
 *       400:
 *         description: No valid fields provided for update.
 *       404:
 *         description: AI not found.
 */
router.put("/:id", upload.single("aiImage"), updateAI);

/**
 * @swagger
 * /ai/{id}:
 *   delete:
 *     summary: Delete an AI entry by ID
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: AI entry ID
 *     responses:
 *       200:
 *         description: AI entry deleted successfully.
 *       404:
 *         description: AI not found.
 */
router.delete("/:id", deleteAI);

/**
 * @swagger
 * /ai/{id}/trending:
 *   patch:
 *     summary: Update the trending status of an AI entry
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: AI entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trending
 *             properties:
 *               trending:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Trending status updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: AI not found.
 */
router.patch("/:id/trending", patchTrendingStatus);

module.exports = router;
