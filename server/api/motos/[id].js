import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'identifiant de la moto est invalide.",
    });
  }

  let rows;

  try {
    [rows] = await db.execute("SELECT * FROM motos WHERE id = ?", [id]);
  } catch (error) {
    console.error("Erreur MySQL lors de la récupération d'une moto :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer la moto.",
    });
  }

  if (!rows[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: `La moto avec l'ID ${id} n'a pas été trouvée.`,
    });
  }

  return rows[0];
});
