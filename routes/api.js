const express = require("express");
const {
  computeRisk,
  addUpdateCondition,
  addUpdateBiomarker,
  computeRiskPostResponse,
} = require("../services/service");
const validate = require("../middleware/validate");
const {
  userBiomarkersSchema,
  computeRiskSchema,
  conditionSchema,
} = require("../validators/inputValidations");
const router = express.Router();

// Compute Risk API, Star of the show... 
/**
 * @route POST /compute-risk
 * @desc  Computes the risk factor for a user based on their biomarkers and a given condition rule
 * @access Public
 * @example Request Body:
 * {
 *   "userId": "user_123",
 *   "conditionId": "cond_001"
 * }
 * @example Success Response:
 * {
 *   "riskFactor": "45.6", --> Indicates the risk Factor
 *   "version": "2"  --> Indicates the version of the condition-rule used
 * }
 */
router.post("/compute-risk", validate(computeRiskSchema), async (req, res) => {
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

/**
 * @route POST /add-condition
 * @desc  Used for adding Conditions... Conditions are stored in version, which can up updated, and the version tagged as
 *  lastest (lastest:true), is considered during risk evaluation
 * @access Public
 * @example Request Body:
 * {
 *   id: "cond_001",  --> Condition Id
 *   name: "cardiovascular_disease_risk", --> Name of the condition (Not used anywhere)
 *   version: "3", --> Just a version tag used for identifying which version was used... (LastCompute and ComputeHistory)
 *   latest: true, --> Signifies whether this is the latest set of rules for a given condition
 *   rules :[] --> Complex....
 * }
 * @example Success Response:
 * {
 *   success; true
 * }
 */

router.post("/add-condition", validate(conditionSchema), async (req, res) => {
  try {
    await addUpdateCondition(
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


/**
 * @route POST /add-biomarker
 * @desc  Used for adding Biomarkers for a user...
 * @access Public
 * @example Request Body:
 * {
 *   userId: "cond_001",
 *   biomarkers: {
 *      marker_1: {
 *          "value": "222",
 *          "timestamp": ISO Format Timestamp, --> Just Metadata
 *          "report": "" --> Just metadata
 *      }
 *   }
 * }
 * @example Success Response:
 * {
 *   success; true
 * }
 */

router.post(
  "/add-biomarker",
  validate(userBiomarkersSchema),
  async (req, res) => {
    try {
      await addUpdateBiomarker(
        req.body.userId,
        req.body.biomarkers
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res
        .status(err.statusCode ?? 500)
        .json({ error: "Invalid data " + err.message.toString() });
    }
  }
);

module.exports = router;
