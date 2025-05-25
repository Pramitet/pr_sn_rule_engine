const mongoose = require('mongoose');
const { Schema } = mongoose;

const lastComputedSchema = new mongoose.Schema({
  userId: String,
  conditionId: String,
  data_used: Schema.Types.Mixed,
  value: String
}, {strict: false});

module.exports = mongoose.model('LastComputed', lastComputedSchema);

/* This would look like

    userId: String,
    conditionId: String,
    data_used: {
        biomarker1: value,
        biomarker2: value
    }
    value: String

*/

