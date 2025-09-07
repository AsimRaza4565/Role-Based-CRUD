import mongoose, { Schema, models } from "mongoose";

const permissionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, //e.g. create:post
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const Permission =
  models.Permission || mongoose.model("Permission", permissionSchema);
export default Permission;
