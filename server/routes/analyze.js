const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");

const analyticsFile = "./analytics.json";

// POST /analyze
router.post("/", async (req, res) => {
  try {
    const imageBuffer = req.body;

    const endpoint = process.env.AZURE_VISION_ENDPOINT;
    const key = process.env.AZURE_VISION_KEY;

    const response = await axios.post(
      `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-10-01&features=tags`,
      imageBuffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": key,
        },
      }
    );

    // Update analytics
    let analytics = JSON.parse(fs.readFileSync(analyticsFile, "utf-8"));
    analytics.imagesAnalyzed++;
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Vision API failed" });
  }
});

module.exports = router;
