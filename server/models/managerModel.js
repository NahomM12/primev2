const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the Manager schema
const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // select: false, // Prevents password from being returned in queries by default
    },
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    refershToken: { type: String },
  },
  { timestamps: true }
);

managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
  next();
});

managerSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Manager", managerSchema);
