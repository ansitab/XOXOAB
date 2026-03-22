const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  uploadedBy: String,
  classification: {
    type: String,
    enum: ["Confidential", "Secret", "Top Secret"],
    default: "Confidential"
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Mission", missionSchema);