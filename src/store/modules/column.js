import Vue from 'vue'
import uuid from 'uuid/v1'
import { updateDocsPositions } from '@/utils'

const state = {
  /**
   * All the columns fro a board
   */
  columns: {}
}

const getters = {
  /**
   * Get all the columns
   */
  getColumns: (state) => state.columns,
  /**
   * Get a single board given its ID
   */
  getColumn: (state) => (columnID) => state.columns[columnID]
}

const mutations = {
  /**
   * Set a single column
   */
  setColumn: (state, column) => { Vue.set(state.columns, column._id, column) },
  /**
   * Set all the columns
   */
  setColumns: (state, columns) => { state.columns = columns },
  /**
   * Remove a column from the state
   */
  removeColumn: (state, columnID) => { Vue.delete(state.columns, columnID) }
}

const actions = {
  /**
   * Create a new column
   */
  createColumn: ({ getters, commit, dispatch }, { boardID, title }) => {
    return getters.getCurrentDB.put({
      _id: `column-${uuid()}`,
      type: 'column',
      title,
      boardID,
      position: Object.keys(getters.getColumns).length,
      timestamp: Date.now()
    })
  },
  /**
   * Renames a column
   */
  renameColumn: ({ getters }, { columnID, title }) => {
    if (title === '') {
      return Promise.reject('Enter a title')
    } else {
      let db = getters.getCurrentDB
      return db.get(columnID)
        .then((columnDoc) => db.put({ ...columnDoc, title: title, timestamp: Date.now() }))
        .then(() => Promise.resolve())
        .catch((error) => Promise.reject(error.reason))
    }
  },
  /**
   * Deletes a column from the database
   */
  deleteColumn: ({ getters, commit }, { columnID }) => {
    let db = getters.getCurrentDB
    return db.get(columnID)
      .then((columnDoc) => db.remove(columnDoc))
      .then(() => getters.getCurrentDB.query('workspace/columnNotes', { include_docs: true, key: columnID }))
      .then(({ rows }) => Promise.all(rows.map(({ doc }) => db.remove(doc))))
      .then(() => {
        commit('removeColumn', columnID)
        return Promise.resolve()
      })
      .catch((error) => Promise.reject(error.reason))
  },
  /**
   * Move a column inside a board, it will change the position of the rest of the columns
   */
  moveColumn: ({ getters, dispatch }, { columnID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    return db.get(columnID)
      .then((columnDoc) => db.bulkDocs([
        { ...columnDoc, position: newPosition, timestamp: Date.now() },
        ...updateDocsPositions({ docs: Object.values(getters.getColumns), oldPosition, newPosition })
      ]))
  },
  /**
 * Adds a note to a column, it will change the position of the rest of the notes
 */
  addNoteToColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    // let updatedNotes = dispatch('updateDocsPositions', { docs: getters.getColumnNotes(columnID)})
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position >= position)
      .map((note) => ({ ...note, position: note.position + 1, timestamp: Date.now() }))
    return db.get(noteID).then((noteDoc) => db.bulkDocs([{ ...noteDoc, position: position, columnID: columnID, timestamp: Date.now() }, ...updatedNotes]))
  },
  /**
   * Removes a note from a column, it will change the position of the rest of the notes
   */
  removeNoteFromColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position > position)
      .map((note) => ({ ...note, position: note.position - 1, timestamp: Date.now() }))
    return db.bulkDocs(updatedNotes)
  },
  /**
   * Moves a note inside a column, it will change the position of the rest of the notes
   */
  moveNoteInColumn: ({ getters }, { columnID, noteID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    let updatedNotes = []
    if (newPosition < oldPosition) {
      updatedNotes = Object.values(getters.getColumnNotes(columnID))
        .filter(({ position }) => position >= newPosition && position < oldPosition)
        .map((note) => ({ ...note, position: note.position + 1, timestamp: Date.now() }))
    } else if (newPosition > oldPosition) {
      updatedNotes = Object.values(getters.getColumnNotes(columnID))
        .filter(({ position }) => position <= newPosition && position > oldPosition)
        .map((note) => ({ ...note, position: note.position - 1, timestamp: Date.now() }))
    }
    db.get(noteID)
      .then((noteDoc) => db.bulkDocs([{ ...noteDoc, position: newPosition, timestamp: Date.now() }, ...updatedNotes]))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
