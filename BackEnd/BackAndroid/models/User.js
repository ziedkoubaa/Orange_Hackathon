// backend/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["student", "entrepreneur"],
    default: "student",
  },
  // Additional Information Fields
  personalInformation: {
    name: { type: String },
    age: { type: Number },
    occupation: { type: String },
    financialDependents: { type: Boolean },
    primaryIncomeEarner: { type: Boolean },
  },
  income: {
    totalMonthlyIncome: { type: Number },
    additionalIncomeSources: { type: String },
    seasonalIncomeChanges: { type: String },
  },
  // ... (include other sections as needed)
});

module.exports = mongoose.model("User", userSchema);
