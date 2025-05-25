const express = require('express');
const { computeRisk } = require('../services/service');
const router = express.Router();


router.post('/compute-risk', async (req, res) => {
  try {
    const result = await computeRisk(req.userId, req.conditionId)
    res.status(200).json({riskFactor: result});
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: 'Invalid data ' + err.message.toString() });
  }
});

module.exports = router;
