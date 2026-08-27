import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  try {
    const [info] = await db.execute("DELETE FROM motos WHERE id = ?", [id]);

    if (info.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `La moto avec l'ID ${id} n'a pas été trouvée.`,
      });
    }

    return { id };
  } catch (error) {
    if (error?.statusCode === 404) {
      throw error;
    }

    console.error("Erreur MySQL lors de la suppression d'une moto :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de supprimer la moto.",
    });
  }
});
