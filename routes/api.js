const express = require("express");
const {
  computeRisk,
  addUpdateCondition,
  addUpdateBiomarker,
  computeRiskPostResponse,
} = require("../services/service");
const router = express.Router();

router.post("/compute-risk", async (req, res) => {
  try {
    const result = await computeRisk(
      req.body.userId,
      req.body.conditionId,
      req.body.force
    );
    res
      .status(200)
      .json({ riskFactor: result.riskFactor, version: result.version });

    // This could be done asynchrously via a Kafka but this also does the same  
    if (!result.cached) {
      await computeRiskPostResponse(
        result.userId,
        result.conditionId,
        result.version,
        result.userMarker,
        result.riskFactor
      );
    }
  } catch (err) {
    res
      .status(err.statusCode ?? 500)
      .json({ error: "Invalid data " + err.message.toString() });
  }
});

router.post("/add-condition", async (req, res) => {
  try {
    const result = await addUpdateCondition(
      req.body.id,
      req.body.name,
      req.body.version,
      req.body.latest,
      req.body.rules
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(err.statusCode ?? 500)
      .json({ error: "Invalid data " + err.message.toString() });
  }
});

router.post("/add-biomarker", async (req, res) => {
  try {
    const result = await addUpdateBiomarker(
      req.body.userId,
      req.body.biomarkers
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(err.statusCode ?? 500)
      .json({ error: "Invalid data " + err.message.toString() });
  }
});

module.exports = router;
