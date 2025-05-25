const { ZERO } = require("../constants/constants");
const StatusError = require("../constants/stausError");
const Conditioins = require("../models/Conditioins");
const LastComputed = require("../models/LastComputed");
const UserMarker = require("../models/UserMarker");
const { evaluateRules } = require("./evaluation");


async function computeRisk(userId, conditionId, force = false) {

    if (!force) {
        const riskFactor = LastComputed.find({userId: userId, conditionId: conditionId})?.lean();
        if (riskFactor) {
            return riskFactor;
        }
    }

    const condition = await Conditioins.find({conditionId: conditionId})?.lean();
    if (!condition) {
        throw new StatusError("Condition Not found", 400);
    }
    const selectColumns = Array.isArray(condition.necessaryBioMarkers) ? condition.necessaryBioMarkers.join(' ') : condition.necessaryBioMarkers
    const userMarker = await UserMarker.find({userId: userId}).select('userId '+selectColumns)?.lean();

    if (!userMarker) {
        throw new StatusError("User Not found", 400);
    }

    const riskFactor = evaluateRules(condition.rules, userMarker, ZERO)?.toString() || '0';
    return riskFactor;
}


module.exports = {
    computeRisk
}