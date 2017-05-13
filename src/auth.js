const TOKEN_KEY = 'token'

export default {
  login: token => localStorage.setItem(TOKEN_KEY, token),
  logout: () => localStorage.removeItem(TOKEN_KEY),
  loggedIn: () => Boolean(localStorage.getItem(TOKEN_KEY))
}
