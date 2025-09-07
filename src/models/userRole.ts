import mongoose, { Schema, models } from "mongoose";

const userRoleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    roleId: { type: Schema.Types.ObjectId, ref: "Role" },
  },
  { timestamps: true }
);

const UserRole = models.UserRole || mongoose.model("UserRole", userRoleSchema);

export default UserRole;
