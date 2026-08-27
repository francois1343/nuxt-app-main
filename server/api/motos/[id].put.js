import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);

  if (!body || !body.marque || !body.modele || !body.couleur) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs marque, modele et couleur sont obligatoires.",
    });
  }

  try {
    const [info] = await db.execute(
      "UPDATE motos SET marque = ?, modele = ?, couleur = ? WHERE id = ?",
      [body.marque, body.modele, body.couleur, id],
    );

    if (info.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `La moto avec l'ID ${id} n'a pas été trouvée.`,
      });
    }

    return {
      id,
      marque: body.marque,
      modele: body.modele,
      couleur: body.couleur,
    };
  } catch (error) {
    if (error?.statusCode === 404) {
      throw error;
    }

    console.error("Erreur MySQL lors de la modification d'une moto :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de modifier la moto.",
    });
  }
});
