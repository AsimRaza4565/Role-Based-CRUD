import mongoose, { Schema, models } from "mongoose";

const eventSchema = new Schema(
  {
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model("Event", eventSchema);

export default Event;
