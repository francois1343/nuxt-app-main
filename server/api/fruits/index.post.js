import { fruitsState } from "~~/server/utils/state";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const newFruit = {
    id: Math.max(0, ...fruitsState.map((fruit) => fruit.id)) + 1,
    label: body.label,
  };

  fruitsState.push(newFruit);
  setResponseStatus(event, 201);

  return newFruit;
});
