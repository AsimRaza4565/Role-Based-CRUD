import mongoose, { Schema, models } from "mongoose";

const RolePermissionSchema = new Schema(
  {
    roleId: { type: Schema.Types.ObjectId, required: true, ref: "Role" },
    permissionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Permission",
    },
  },
  { timestamps: true }
);

const RolePermission =
  models.RolePermission ||
  mongoose.model("RolePermission", RolePermissionSchema);

export default RolePermission;
