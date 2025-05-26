const mongoose = require('mongoose');
const { Schema } = mongoose;

const lastComputedSchema = new mongoose.Schema({
  userId: Schema.Types.String,
  conditionId: Schema.Types.String,
  data_used: Schema.Types.Mixed,
  value: Schema.Types.String,
  depreciated: Schema.Types.Boolean,
  version: Schema.Types.String
}, {strict: false});

module.exports = mongoose.model('LastComputed', lastComputedSchema);

// Stores the last computed risk factor for the user agaist a condition
// Stored in a sepereate collection as it can be fetched quicker

/* This would look like

    userId: String,
    conditionId: String,
    data_used: {
        biomarker1: value,
        biomarker2: value
    }
    value: String
    depreciated: Boolean --> This is important if this is true, we need to calculate a new risk value
                             Will be changed to true, when a biomarker/condition is added/updated.

*/

