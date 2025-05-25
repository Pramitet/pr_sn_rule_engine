const mongoose = require('mongoose');
const { Schema } = mongoose;

const ComputeHistorySchema = new mongoose.Schema({
  userId: Schema.Types.String,
  conditionId: Schema.Types.String,
  version: Schema.Types.String,
  data_used: Schema.Types.Mixed,
  value: Schema.Types.String
}, {strict: false});

module.exports = mongoose.model('CompuateHistory', ComputeHistorySchema);

/* This would look like

    userId: String,
    conditionId: String,
    version: String
    data_used: {
        biomarker1: value,
        biomarker2: value
    }
    value: String
    depreciated: Boolean
*/

