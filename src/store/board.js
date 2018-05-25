import Vue from 'vue'
import slugify from 'slugify'
import uuid from 'uuid/v1'
import { removeFromArray } from '../utils'
import values from 'object.values'

const state = {
  boards: {},
  currentBoard: '',
  columns: {},
  notes: {}
}

const getters = {
  getBoards: (state) => state.boards,
  getBoard: (state) => (boardID) => state.boards[boardID],
  getColumns: (state) => state.currentBoard && state.boards && state.columns && state.boards[state.currentBoard] && values(state.columns).filter((column) => state.boards[state.currentBoard].columns.includes(column._id)),
  getColumn: (state) => (columnID) => state.columns[columnID],
  getColumnNotes: (state) => (columnID) => values(state.notes).filter((note) => state.columns[columnID].notes.includes(note._id))
}

const mutations = {
  setCurrentBoard: (state, board) => { Vue.set(state, 'currentBoard', board) },
  setBoards: (state, boards) => { Vue.set(state, 'boards', boards) },
  setBoard: (state, board) => { Vue.set(state.boards, board._id, board) },
  removeBoard: (state, boardID) => { Vue.delete(state.boards, boardID) },
  setColumn: (state, column) => { Vue.set(state.columns, column._id, column) },
  removeColumn: (state, columnID) => { Vue.delete(state.columns, columnID) },
  setNote: (state, note) => { Vue.set(state.notes, note._id, note) },
  removeNote: (state, noteID) => { Vue.delete(state.notes, noteID) }
}

const actions = {
  /**
   * Create a new board
   */
  createBoard: ({ getters, commit, dispatch }, { workspaceID, title }) => {
    return getters.getCurrentDB.put({
      _id: `${slugify(title, { lower: true })}-${Date.now()}`,
      type: 'board',
      title,
      timestamp: Date.now()
    })
  },
  /**
   * Create a new column
   */
  createColumn: ({ getters, commit, dispatch }, { boardID, title }) => {
    return getters.getCurrentDB.put({
      _id: `column-${uuid()}`,
      type: 'column',
      title,
      position: Object.keys(getters.getColumns).length,
      timestamp: Date.now()
    })
  },
  /**
   * Create a new note
   */
  createNote: ({ getters, dispatch }, { columnID, text }) => {
    return getters.getCurrentDB.put({
      _id: `note-${uuid()}`,
      text: text,
      position: 0,
      type: 'note'
    })
  },
  /**
   * read all de boards from a workspace and sets the to the store
   */
  readBoards: ({ getters, commit }, workspaceID) => {
    return getters.getCurrentDB.query('workspace/boards', {include_docs: true})
      .then(({ rows }) => {
        rows.forEach(({ doc }) => commit('setBoard', doc))
        return Promise.resolve()
      })
  },
  /**
   * Read all the columns from a workspace
   */
  readColumns: ({ getters, commit, dispatch }, { workspaceID, boardID }) => {
    getters.getCurrentDB.allDocs({ include_docs: true, keys: getters.getBoard(boardID).columns }).then((columns) => {
      columns.rows.forEach(({ doc }) => {
        commit('setColumn', doc)
        dispatch('readNotes', doc.notes)
      })
    })
  },
  /**
   * Read all the notes from a workspace
   */
  readNotes: ({ getters, commit, dispatch }, notes) => {
    return getters.getCurrentDB.allDocs({ include_docs: true, keys: notes })
      .then((notes) => notes.rows.forEach(({ doc }) => commit('setNote', doc)))
  },
  /**
   * Move a column inside a board, it will change the position of the rest of the columns
   */
  moveColumn: ({ getters }, { columnID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    let updatedColumns = []
    if (newPosition < oldPosition) {
      updatedColumns = getters.getColumns
        .filter(({ position }) => position >= newPosition && position < oldPosition)
        .map((column) => ({ ...column, position: column.position + 1 }))
    } else if (newPosition > oldPosition) {
      updatedColumns = getters.getColumns
        .filter(({ position }) => position <= newPosition && position > oldPosition)
        .map((column) => ({ ...column, position: column.position - 1 }))
    }
    return db.get(columnID)
      .then((columnDoc) => db.bulkDocs([{ ...columnDoc, position: newPosition }, ...updatedColumns]))
  },
  /**
   * Adds a note to a column, it will change the position of the rest of the notes
   */
  addNoteToColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position >= position)
      .map((note) => ({ ...note, position: note.position + 1 }))
    return db.get(columnID)
      .then((columnDoc) => db.bulkDocs([{ ...columnDoc, notes: [...columnDoc.notes, noteID] }, ...updatedNotes]))
  },
  /**
   * Removes a note from a column, it will change the position of the rest of the notes
   */
  removeNoteFromColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position >= position)
      .map((note) => ({ ...note, position: note.position - 1 }))
    return db.get(columnID)
      .then((columnDoc) => db.bulkDocs([{ ...columnDoc, notes: removeFromArray(columnDoc.notes, noteID) }, ...updatedNotes]))
  },
  /**
   * Moves a note inside a column, it will change the position of the rest of the notes
   */
  moveNoteInColumn: ({ getters }, { columnID, noteID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    let updatedNotes = []
    if (newPosition < oldPosition) {
      updatedNotes = getters.getColumnNotes(columnID)
        .filter(({ position }) => position >= newPosition && position < oldPosition)
        .map((note) => ({ ...note, position: note.position + 1 }))
    } else if (newPosition > oldPosition) {
      updatedNotes = getters.getColumnNotes(columnID)
        .filter(({ position }) => position <= newPosition && position > oldPosition)
        .map((note) => ({ ...note, position: note.position - 1 }))
    }
    db.get(noteID)
      .then((noteDoc) => db.bulkDocs([{ ...noteDoc, position: newPosition }, ...updatedNotes]))
  },
  /**
   * Updates the position of a note
   */
  updateNotePosition: ({ getters }, { noteID, newPosition }) => {
    let db = getters.getCurrentDB
    db.get(noteID).then((noteDoc) => db.put({ ...noteDoc, position: newPosition }))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
