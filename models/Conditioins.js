const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  conditionId: mongoose.Schema.Types.String,
  name: mongoose.Schema.Types.String,
  necessaryBioMarkers: mongoose.Schema.Types.Array,
  rules: mongoose.Schema.Types.Mixed,
  latest: mongoose.Schema.Types.Boolean
}, {strict: false});

module.exports = mongoose.model('Condition', conditionSchema);


/*

A condtion would look like

{
    conditionId: "Test"
    name: "Test",
    rules: [
        {
            type: "RELATION"/"RAW_NUMBER"
            left?: {}.
            right?: {},
            operand?: "",
            value: String
        }
    ]
}

left/right: {
    type: ARITHEMATIC, BIOMARKER, RAW_VALUE
    leff?: {},
    right?: {},
    value?: String
    operand?: ""
}

*/