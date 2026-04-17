import Permission from "../models/permission";
import { connectDatabase } from "./mongodb";

const defaultPermissions = [
  { name: "user read", slug: "user-read" },
  { name: "role read", slug: "role-read" },
  { name: "permission read", slug: "permission-read" },
];

let defaultPermissionsSeedPromise: Promise<void> | null = null;

export async function ensureDefaultPermissions() {
  if (!defaultPermissionsSeedPromise) {
    defaultPermissionsSeedPromise = (async () => {
      await connectDatabase();

      await Permission.bulkWrite(
        defaultPermissions.map(({ name, slug }) => ({
          updateOne: {
            filter: { slug },
            update: { $setOnInsert: { name, slug } },
            upsert: true,
          },
        }))
      );
    })().catch((error) => {
      defaultPermissionsSeedPromise = null;
      throw error;
    });
  }

  return defaultPermissionsSeedPromise;
}
