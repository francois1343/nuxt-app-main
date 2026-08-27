import Database from "better-sqlite3";

const db = new Database("database.db");

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, "id"));
  const activity = db.prepare("SELECT * FROM activities WHERE id = ?").get(id);

  if (!activity) {
    throw createError({
      statusCode: 404,
      statusMessage: `L’activité avec l’ID ${id} n’a pas été trouvée.`,
    });
  }

  db.prepare("DELETE FROM activities WHERE id = ?").run(id);

  return activity;
});
