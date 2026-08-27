import { db } from "~~/server/utils/db";
import { createSessionToken } from "~~/server/utils/session";

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

  // 5. Créer puis stocker la session dans un cookie inaccessible à JavaScript.
  const config = useRuntimeConfig();
  const tokenValue = rows[0].id + rows[0].login;
  const token = createSessionToken(tokenValue, config.apiSecretToken);

  setCookie(event, "api_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return {
    message: "Authentification réussie.",
    user: rows[0],
  };
});
