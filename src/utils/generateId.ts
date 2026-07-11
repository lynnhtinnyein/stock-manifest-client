import { customAlphabet } from "nanoid";

// 12 digits is safe for the standard Number type
const nanoid = customAlphabet("123456789", 12);

//always return negative to avoid conflict with any existing positive IDs from the backend
export const generateId = () => -Number(nanoid());
