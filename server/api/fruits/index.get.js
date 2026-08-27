import { fruitsState } from "~~/server/utils/state";

export default defineEventHandler(() => {
  return fruitsState;
});