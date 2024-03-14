import { ObjectId } from "mongodb";

export function validateObjectId(id) {
  const isValid = ObjectId.isValid(id);
  if (!isValid) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }

  return id;
}
