import { db } from "~~/server/utils/db";

const editableFields = ["marque", "modele", "couleur"];

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  const fields = editableFields.filter((field) => body?.[field] !== undefined);

  if (fields.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Indiquez au moins un champ à modifier.",
    });
  }

  if (fields.some((field) => !body[field])) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs modifiés ne peuvent pas être vides.",
    });
  }

  const assignments = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => body[field]);

  try {
    const [info] = await db.execute(
      `UPDATE motos SET ${assignments} WHERE id = ?`,
      [...values, id],
    );

    if (info.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `La moto avec l'ID ${id} n'a pas été trouvée.`,
      });
    }

    const [rows] = await db.execute("SELECT * FROM motos WHERE id = ?", [id]);

    return rows[0];
  } catch (error) {
    if (error?.statusCode === 404) {
      throw error;
    }

    console.error("Erreur MySQL lors de la modification partielle d'une moto :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de modifier la moto.",
    });
  }
});
