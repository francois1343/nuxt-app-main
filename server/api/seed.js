// server/api/seed.get.js

if (process.env.NODE_ENV === 'production') {
  throw createError({
    statusCode: 403,
    statusMessage: 'Le rechargement des seeds est interdit en production.'
  })
}

import Database from 'better-sqlite3'

const db = new Database('database.db')

export default defineEventHandler((event) => {
  // ## activities
  // 1. Supprimer la table existante si elle existe
  db.exec(`DROP TABLE IF EXISTS activities`)

  // 2. Recréer la table propre
  db.exec(`
    CREATE TABLE activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        duration TEXT NOT NULL,
        done INTEGER DEFAULT 0
        )
  `)

  // 3. Préparer l'insertion de jeu de données de test (seeds)
  let insert = db.prepare('INSERT INTO activities (title, duration) VALUES (?, ?)')

  // 4. Insérer le jeu de données
  let seeds = [
    ['Développement Nuxt 4', '2h'],
    ['Configuration SQLite', '1h'],
    ['Création d\'un middleware Nitro', '30m'],
    ['Gestion du State avec useState', '1h30']
  ]

  for (const [title, duration] of seeds) {
    insert.run(title, duration)
  }

  //## Users
  // 1. Supprimer la table existante si elle existe
  db.exec(`DROP TABLE IF EXISTS users`)

  // 2. Recréer la table propre
  db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT NOT NULL,
        pass TEXT NOT NULL,
        role TEXT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin'))
        )
  `)

  // 3. Préparer l'insertion de jeu de données de test (seeds)
  insert = db.prepare('INSERT INTO users (login, pass, role) VALUES (?, ?, ?)')

  // 4. Insérer le jeu de données
  seeds = [
    ['admin', 'pass', 'admin'],
    ['pierre', 'pass', 'user'],
    ['marcel', 'pass', 'editor'],
    ['sophie', 'pass', 'user']
  ]

  for (const [login, pass, role] of seeds) {
    insert.run(login, pass, role)
  }

  // 5. Message de confirmation
  return {
    success: true,
    message: 'La base de données SQLite a été réinitialisée avec succès !',
    totalInserted: seeds.length
  }
})