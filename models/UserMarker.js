const mongoose = require('mongoose');
const { Schema } = mongoose;

const userMarkerSchema = new mongoose.Schema({
  userId: String,
  metadata: Schema.Types.Mixed
}, {strict: false});

module.exports = mongoose.model('UserMarker', userMarkerSchema);

/*

UserMarkers would look like

{
    userId: String,
    metadata: {
        biomarker1: [{
            Value: “”
			timestamp: “”
			report: “
        }]
    },
    biomarker1: "value",
    biomarker2: "value"
}

*/
