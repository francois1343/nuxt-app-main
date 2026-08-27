import { fruitsState } from "~~/server/utils/state";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  const index = fruitsState.findIndex((fruit) => fruit.id === id);

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: `Le fruit avec l'ID ${id} n'a pas été trouvé.`,
    });
  }

  if (typeof body?.label !== "string" || !body.label.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le champ label doit être une chaîne non vide.",
    });
  }

  fruitsState[index] = {
    ...fruitsState[index],
    label: body.label.trim(),
  };

  return fruitsState[index];
});
