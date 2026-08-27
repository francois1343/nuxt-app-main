// server/middleware/auth.js
import { isSessionTokenValid } from "~~/server/utils/session"

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // 1. Filtrer : on ne protège QUE les méthodes de modification (POST, PUT, PATCH, DELETE) sur /api/
  const isProtectedMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method)
  const isApiRoute = url.pathname.startsWith('/api/')
  const isAuthRoute = url.pathname === '/api/auth'

  // L'authentification doit rester accessible sans token ; les GET aussi.
  if (!isApiRoute || !isProtectedMethod || isAuthRoute) {
    return
  }

  // 2. Lire le cookie envoyé automatiquement avec la requête.
  const token = getCookie(event, 'api_token')

  const config = useRuntimeConfig()

  // 3. Vérifier la signature du token.
  if (!isSessionTokenValid(token, config.apiSecretToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès refusé : Token d\'API invalide ou manquant.'
    })
  }
})
