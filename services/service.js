const { ZERO, OPERAND_TYPE } = require("../constants/constants");
const StatusError = require("../constants/stausError");
const ComputeHistory = require("../models/ComputeHistory");
const Conditioins = require("../models/Conditioins");
const LastComputed = require("../models/LastComputed");
const UserMarker = require("../models/UserMarker");
const { evaluateRules } = require("./evaluation");

async function computeRisk(userId, conditionId, force = false) {
  if (!force) {
    const dbRiskFactor = await LastComputed.findOne({
      userId: userId,
      conditionId: conditionId,
      depreciated: false,
    })?.lean();
    if (dbRiskFactor) {
      return {
        riskFactor: dbRiskFactor.value,
        version: dbRiskFactor.version,
        cached: true,
      };
    }
  }

  const condition = await Conditioins.findOne({
    conditionId: conditionId,
    latest: true,
  })?.lean();
  if (!condition) {
    throw new StatusError("Condition Not found", 400);
  }
  const selectColumns = Array.isArray(condition.necessaryBioMarkers)
    ? condition.necessaryBioMarkers.join(" ")
    : condition.necessaryBioMarkers;
  const userMarker = await UserMarker.findOne({ userId: userId })
    .select("userId " + selectColumns)
    ?.lean();

  if (!userMarker) {
    throw new StatusError("User Not found", 400);
  }
  console.log(userMarker);

  const riskFactor =
    (await evaluateRules(condition.rules, userMarker, ZERO))?.toString() || "0";
  return {
    riskFactor: riskFactor,
    userId: userId,
    conditionId: conditionId,
    version: condition.version,
    userMarker: userMarker,
  };
}

async function computeRiskPostResponse(
  userId,
  conditionId,
  version,
  userMarker,
  riskFactor
) {
  await LastComputed.findOneAndUpdate(
    {
      userId: userId,
      conditionId: conditionId,
    },
    {
      $set: {
        ...userMarker,
        userId: userId,
        conditionId: conditionId,
        value: riskFactor,
        depreciated: false,
        version: version,
      },
    },
    {
      upsert: true,
    }
  );

  const compusteHistory = new ComputeHistory({
    userId: userId,
    conditionId: conditionId,
    version: version,
    data_used: userMarker,
    value: riskFactor,
  });

  await compusteHistory.save();
}

async function addUpdateCondition(id, name, version, latest, rules) {
  if (!rules || rules.length <= 0) {
    throw new StatusError("Invalid Rules", 400);
  }
  let necessaryBioMarkers = [];
  for (const rule of rules) {
    if (
      rule?.type !== OPERAND_TYPE.RELATIONAL &&
      rule?.type !== OPERAND_TYPE.RAW_VALUE
    ) {
      throw new StatusError("Invalid Rules", 400);
    }
    necessaryBioMarkers = findNecessaryBioMarkers(rule, necessaryBioMarkers);
  }

  await Conditioins.updateOne(
    { conditionId: id, version: version },
    {
      $set: {
        conditionId: id,
        name: name,
        version: version,
        necessaryBioMarkers: necessaryBioMarkers,
        rules: rules,
        latest: latest,
      },
    },
    { upsert: true }
  );

  if (latest) {
    await Conditioins.updateOne(
      { conditionId: id, version: { $ne: version } },
      { $set: { latest: false } }
    );
    await LastComputed.updateMany(
      { conditionId: id },
      { $set: { depreciated: true } }
    );
  }
}
//TODO: We could just convert the entire rule to String and do a regex match... Need to find which is faster
function findNecessaryBioMarkers(rule, result = []) {
  if (!rule) {
    return;
  }
  if (rule.type === OPERAND_TYPE.BIO_MARKER) {
    result.push(rule.value);
    return result;
  }
  if (
    rule.type === OPERAND_TYPE.ARITHEMATIC ||
    rule.type === OPERAND_TYPE.RELATIONAL
  ) {
    result = findNecessaryBioMarkers(rule.left, result);
    result = findNecessaryBioMarkers(rule.right, result);
  }
  return result;
}

/*
biomarkers => {
        biomarker1: {
            value: "",
            timestamp: "",
            report: ""
        },
        biomarker2: {
            value: "",
            timestamp: "",
            report: ""
        }
    }

*/

async function addUpdateBiomarker(userId, biomarkers) {
  const bioMarkerKeyValue = {};
  let isEmpty = true;

  const user = await UserMarker.findOne({ userId: userId })?.lean();
  let metadata = {};

  if (user) {
    metadata = user.metadata;
  }

  for (const [key, value] of Object.entries(biomarkers)) {
    if (!value || !value.value) {
      throw new StatusError("Biomarker Value is mandatory", 400);
    }
    isEmpty = false;
    bioMarkerKeyValue[key] = value.value;
    if (!metadata[key]) {
      metadata[key] = [];
    }
    metadata[key].push(value);
  }

  await UserMarker.updateOne(
    { userId: userId },
    {
      $set: {
        ...bioMarkerKeyValue,
        metadata: metadata,
      },
    },
    { upsert: true }
  );

  await LastComputed.updateMany(
    { userId: userId },
    { $set: { depreciated: true } }
  );
}

module.exports = {
  computeRisk,
  addUpdateCondition,
  addUpdateBiomarker,
  computeRiskPostResponse,
};
