const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: String }, // e.g. "2025-09-01"
    dueTime: { type: String }, // ✅ Add this: e.g. "14:30"
    order: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent reverting a completed task back to incomplete on .save()
todoSchema.pre("save", async function (next) {
  if (!this.isNew && this.isModified("completed")) {
    const existing = await this.constructor.findById(this._id).lean();
    if (existing && existing.completed === true && this.completed === false) {
      return next(new Error("Completed tasks cannot be marked as incomplete"));
    }
  }
  next();
});

// 🚫 Prevent reverting in findOneAndUpdate (used by findByIdAndUpdate)
todoSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && Object.prototype.hasOwnProperty.call(update, "completed")) {
    const docToUpdate = await this.model.findOne(this.getQuery()).lean();
    if (docToUpdate && docToUpdate.completed === true && update.completed === false) {
      return next(new Error("Completed tasks cannot be marked as incomplete"));
    }
  }
  next();
});

module.exports = mongoose.model("Todo", todoSchema);
