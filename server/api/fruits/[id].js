import { fruitsState } from "~~/server/utils/state";

export default defineEventHandler((event) => {
  // 1. Récupération du paramètre "id" depuis l'url
  const id = Number(getRouterParam(event, "id"));

  // const index = fruitsState.findIndex(item) => item.id == id);

  const fruit = fruitsState.find((item) => item.id == id);

  // 2. Gestion du cas où la ressource n'existe pas.
  if (!fruit) {
    throw createError({
      statusCode: 404,
      statusMessage: `Le fruit avec l'ID ${id} n'a pas été trouvé.`,
    });
  }

  return fruit;
});