import Database from "better-sqlite3";

const db = new Database("database.db");

export default defineEventHandler(async (event) => {
  // 1. Récupérer les données envoyées par le formulaire.
  const body = await readBody(event);

  // 2. Vérifier que les deux champs sont remplis.

  if (!body || !body.title || !body.duration) {
    throw createError({
      statusCode: 400,
      statusMessage: "Les champs titre et la durée sont obligatoires.",
    });
  }

  // 3. Ajouter l'activité dans SQLite.
  const rq = db.prepare("INSERT INTO activities (title, duration) VALUES (?, ?)");
  const info = rq.run(body.title, body.duration);

  // 4. Répondre avec l'activité créée.
  setResponseStatus(event, 201);

  return {
    id: info.lastInsertRowid,
    title: body.title,
    duration: body.duration,
  };
});
