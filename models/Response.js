const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 Add userId
  responses: { type: Object, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", ResponseSchema);

module.exports = Response;
