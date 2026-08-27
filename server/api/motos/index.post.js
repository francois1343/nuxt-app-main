import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || !body.marque || !body.modele || !body.couleur) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs marque, modele et couleur sont obligatoires.",
    });
  }

  try {
    const [info] = await db.execute(
      "INSERT INTO motos (marque, modele, couleur) VALUES (?, ?, ?)",
      [body.marque, body.modele, body.couleur],
    );

    setResponseStatus(event, 201);

    return {
      id: info.insertId,
      marque: body.marque,
      modele: body.modele,
      couleur: body.couleur,
    };
  } catch (error) {
    console.error("Erreur MySQL lors de l'ajout d'une moto :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible d'ajouter la moto.",
    });
  }
});
