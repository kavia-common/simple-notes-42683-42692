import { computed, reactive, ref, watch } from 'vue'

// Types
export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt?: number
}

type Draft = {
  title: string
  content: string
}

const STORAGE_KEY = 'simple-notes.v1'
const SELECTED_KEY = 'simple-notes.selected'

// Simple UUID v4-ish generator for local usage (not crypto-strong)
function uuid() {
  // PUBLIC_INTERFACE
  /** Generate a pseudo UUID string suitable for local identifiers. */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

// Internal reactive state (singleton across app)
const state = reactive({
  notes: [] as Note[],
  query: '',
  selectedId: null as string | null,
  draft: { title: '', content: '' } as Draft,
  original: { title: '', content: '' } as Draft,
})

const isClient = typeof window !== 'undefined'

// PUBLIC_INTERFACE
export function useNotes() {
  /** Composable providing CRUD operations for notes using localStorage. */
  const notes = computed(() => state.notes)
  const selectedId = computed(() => state.selectedId)
  const selectedNote = computed<Note | null>(() => state.notes.find(n => n.id === state.selectedId) || null)
  const query = computed({
    get: () => state.query,
    set: (v: string) => { state.query = v }
  })
  const draft = computed(() => state.draft)
  const isDirty = computed(() => state.draft.title !== state.original.title || state.draft.content !== state.original.content)

  const filteredNotes = computed(() => {
    const q = state.query.trim().toLowerCase()
    if (!q) return [...state.notes].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
    return state.notes
      .filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
      )
      .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
  })

  function setQuery(q: string) {
    state.query = q
  }

  function selectNote(id: string | null) {
    state.selectedId = id
    if (isClient) localStorage.setItem(SELECTED_KEY, id || '')
    const n = state.notes.find(n => n.id === id)
    state.draft = { title: n?.title || '', content: n?.content || '' }
    state.original = { ...state.draft }
  }

  function updateDraft(payload: Partial<Draft>) {
    state.draft = { ...state.draft, ...payload }
    // autosave on pause of typing
    debouncedAutoSave()
  }

  function createNote() {
    const id = uuid()
    const now = Date.now()
    const note: Note = { id, title: 'Untitled', content: '', createdAt: now, updatedAt: now }
    state.notes.unshift(note)
    persist()
    state.selectedId = id
    if (isClient) localStorage.setItem(SELECTED_KEY, id)
    state.draft = { title: note.title, content: note.content }
    state.original = { ...state.draft }
    return id
  }

  async function saveNote() {
    const id = state.selectedId
    if (!id) return false
    const idx = state.notes.findIndex(n => n.id === id)
    if (idx === -1) return false
    if (!isDirty.value) return false
    const updated = {
      ...state.notes[idx],
      title: state.draft.title,
      content: state.draft.content,
      updatedAt: Date.now(),
    }
    state.notes.splice(idx, 1, updated)
    state.original = { ...state.draft }
    persist()
    return true
  }

  function deleteNote(id: string) {
    const idx = state.notes.findIndex(n => n.id === id)
    if (idx !== -1) {
      state.notes.splice(idx, 1)
      persist()
    }
    if (state.selectedId === id) {
      const next = state.notes[0]?.id || null
      selectNote(next)
    }
  }

  function persist() {
    if (!isClient) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes))
    } catch (e) {
      console.warn('Failed saving notes', e)
    }
  }

  const debouncedAutoSave = debounce(() => {
    // only autosave when not empty and there is a selected note
    if (state.selectedId && isDirty.value) {
      saveNote()
    }
  }, 800)

  function loadFromStorage() {
    if (!isClient) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr: Note[] = raw ? JSON.parse(raw) : []
      state.notes = Array.isArray(arr) ? arr : []
      // restore selected
      const savedSelected = localStorage.getItem(SELECTED_KEY) || ''
      const exists = state.notes.find(n => n.id === savedSelected)
      selectNote(exists ? savedSelected : (state.notes[0]?.id || null))
    } catch (e) {
      console.warn('Failed reading notes', e)
    }
  }

  return {
    notes,
    filteredNotes,
    query,
    selectedId,
    selectedNote,
    draft,
    isDirty,
    setQuery,
    selectNote,
    updateDraft,
    saveNote,
    createNote,
    deleteNote,
    loadFromStorage,
  }
}
