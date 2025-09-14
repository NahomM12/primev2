const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var locationSchema = new mongoose.Schema(
  {
    region_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    subregion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubRegion",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coords: {
      type: {
        type: String,
        enum: ["Point"],
        // required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add a 2dsphere index for geospatial queries
locationSchema.index({ coords: "2dsphere" });

//Export the model
module.exports = mongoose.model("Location", locationSchema);
