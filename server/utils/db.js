// server/utils/db.js
import mysql from 'mysql2/promise'

const config = useRuntimeConfig()

// Création du pool de connexions vers le MySQL distant
export const db = mysql.createPool({
  host: config.dbHost,
  port: Number(config.dbPort),
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Indispensable si votre hébergeur exige SSL (ex: PlanetScale, Aiven, Azure)
  // ssl: { rejectUnauthorized: true } 
})