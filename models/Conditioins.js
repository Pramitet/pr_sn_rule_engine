const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  conditionId: String,
  name: String,
  necessaryBioMarkers: mongoose.Schema.Types.Array,
  rules: mongoose.Schema.Types.Mixed
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
            value: NUMBER
        }
    ]
}

left/right: {
    type: ARITHEMATIC, BIOMARKER, RAW_VALUE
    leff?: {},
    right?: {},
    value?: NUMBER
    operand?: ""
}

*/