const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  conditionId: mongoose.Schema.Types.String,
  name: mongoose.Schema.Types.String,
  necessaryBioMarkers: mongoose.Schema.Types.Array,
  rules: mongoose.Schema.Types.Mixed,
  latest: mongoose.Schema.Types.Boolean
}, {strict: false});

module.exports = mongoose.model('Condition', conditionSchema);


// Stores Conditions
// Assuming the root of the rule will always be a relation operator or a raw value...
// Can do four types of operations
//     1) RAW_VALUE -> Just a harcoded value
//     2) BIO_MARKER -> Get the relevant BIO_MARKER Data of the user
//     3) ARITHEMATIC -> Used for doing some arthimatic opertions form given values.
//                       There might be a spelling mistake, but I have in too deep to correct it. 
//     4) RELATIONAL  -> Used for conditions...


// RELATIONAL and ARITHEMATIC types whould have left and right used to indicate operands, which can be either of the four discussed values


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