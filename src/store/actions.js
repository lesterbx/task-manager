export default {
  createBoard: ({ state }, workspace, board) => {
    state.workspaces[workspace][board.id] = board
  },
  createAccount: ({ state, dispatch }, { email, password, ...metadata }) => {
    return state.authDB.signUp(email, password, { metadata })
      .then(console.log)
      .catch(console.log)
      // .then(() => dispatch('login', {email, password}))
      // .catch(error => Promise.reject(error.reason))
  },
  login: ({ state, commit }, { email, password }) => {
    return state.authDB.logIn(email, password)
      .then((session) => commit('setSession', {authenticated: true, email: session.name}))
      .catch(error => Promise.reject(error.reason))
  }
}
