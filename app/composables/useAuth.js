// app/composables/useAuth.js
export const useAuth = () => {
  // Stocke le token dans un cookie sécurisé (survit au F5)
  const token = useCookie('api_token', {
    maxAge: 60 * 60 * 24 * 7 // Valide 7 jours
  })

  const setToken = (newToken) => {
    token.value = newToken
  }

  const logout = () => {
    token.value = null
  }

  return {
    token,
    setToken,
    logout,
    isAuthenticated: computed(() => !!token.value)
  }
}