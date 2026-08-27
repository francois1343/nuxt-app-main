import { fruitsState } from "~~/server/utils/state";

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, "id"));
  const index = fruitsState.findIndex((fruit) => fruit.id === id);

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: `Le fruit avec l'ID ${id} n'a pas été trouvé.`,
    });
  }

  const [deletedFruit] = fruitsState.splice(index, 1);

  return deletedFruit;
});
