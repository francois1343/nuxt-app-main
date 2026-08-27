import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  // 1. Récupérer les identifiants envoyés par le client.
  const body = await readBody(event);
  const login = body?.login?.trim();
  const pass = body?.pass;

  // 2. Vérifier que les deux champs sont présents.
  if (!login || !pass) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs login et pass sont obligatoires.",
    });
  }

  let rows;

  try {
    // 3. Chercher l'utilisateur sans renvoyer son mot de passe.
    [rows] = await db.execute(
      "SELECT id, login, role FROM users WHERE login = ? AND pass = ?",
      [login, pass],
    );
  } catch (error) {
    console.error("Erreur MySQL lors de l'authentification :", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de vérifier les identifiants.",
    });
  }

  // 4. Refuser les identifiants incorrects.
  if (rows.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "Login ou mot de passe incorrect.",
    });
  }

  return {
    message: "Authentification réussie.",
    user: rows[0],
  };
});
