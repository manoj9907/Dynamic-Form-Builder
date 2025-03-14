const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  type: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  defaultValue: { type: mongoose.Schema.Types.Mixed, default: null },
  options: { type: [String], default: [] },
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  fields: { type: [FieldSchema], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔥 Add userId reference
  createdAt: { type: Date, default: Date.now },
});

// Middleware to generate a unique slug
FormSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug =
      this.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  }
  next();
});

const Form = mongoose.model("Form", FormSchema);

module.exports = Form;
