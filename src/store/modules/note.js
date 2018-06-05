import Vue from 'vue'
import uuid from 'uuid/v1'

const state = {
  notes: {}
}

const getters = {
  getColumnNotes: (state) => (columnID) => Object.values(state.notes).filter((note) => note.columnID === columnID),
  getNote: (state) => (noteID) => state.notes[noteID]
}

const mutations = {
  setNote: (state, note) => { Vue.set(state.notes, note._id, note) },
  setNotes: (state, notes) => { state.notes = notes },
  removeNote: (State, noteID) => { Vue.delete(state.notes, noteID) }
}

const actions = {
  /**
   * Create a new note
   */
  createNote: ({ getters, dispatch }, { boardID, columnID, text }) => {
    let noteID = `note-${uuid()}`
    return getters.getCurrentDB.put({
      _id: noteID,
      boardID,
      columnID,
      text: text,
      position: 0,
      type: 'note',
      timestamp: Date.now()
    }).then(() => dispatch('addNoteToColumn', { columnID, noteID, position: 0 }))
  },
  /**
   * UPdates the text of a note
   */
  updateNote: ({ getters, dispatch }, { noteID, text }) => {
    let db = getters.getCurrentDB
    return db.get(noteID)
      .then((noteDoc) => db.put({ ...noteDoc, text, timestamp: Date.now() }))
  },
  /**
   * Removes a note from the database
   */
  deleteNote: ({ getters, commit }, { noteID }) => {
    let db = getters.getCurrentDB
    return db.get(noteID)
      .then((noteDoc) => db.remove(noteDoc))
      .then(() => {
        commit('removeNote', noteID)
        return Promise.resolve()
      })
  },
  /**
   * Updates the position of a note
   */
  updateNotePosition: ({ getters }, { noteID, newPosition }) => {
    let db = getters.getCurrentDB
    db.get(noteID).then((noteDoc) => db.put({ ...noteDoc, position: newPosition, timestamp: Date.now() }))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
