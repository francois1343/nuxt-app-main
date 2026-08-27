import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await db.query('SELECT * FROM motos')
    return rows
  } catch (error) {
    console.error('Erreur MySQL lors de la récupération des motos :', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les motos.'
    })
  }
})
