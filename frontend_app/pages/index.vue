<template>
  <div class="app-root">
    <AppHeader
      :selected-note="selectedNote"
      @create="onCreate"
      @save="onSave"
    />

    <div class="container">
      <aside class="sidebar">
        <div class="search-bar">
          <input
            v-model="query"
            type="search"
            placeholder="Search notes..."
            @input="onSearch"
            :aria-label="'Search notes'"
          />
        </div>

        <NoteList
          :notes="filteredNotes"
          :selected-id="selectedId"
          @select="onSelect"
        />

        <div v-if="!notes.length" class="empty">
          <p>No notes yet.</p>
          <button class="btn btn-primary" @click="onCreate">Create first note</button>
        </div>
      </aside>

      <main class="editor-area">
        <NoteEditor
          v-if="selectedNote"
          :note="draft"
          :dirty="isDirty"
          :status="statusMessage"
          @update="onDraftUpdate"
          @save="onSave"
          @delete="onDelete"
        />
        <div v-else class="empty-state">
          <h2>Welcome</h2>
          <p>Select a note from the list or create a new one to get started.</p>
          <button class="btn btn-primary" @click="onCreate">New note</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import NoteList from '~/components/NoteList.vue'
import NoteEditor from '~/components/NoteEditor.vue'
import { useNotes } from '~/composables/useNotes'

const {
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
  loadFromStorage
} = useNotes()

const statusMessage = ref<string>('')

function onSearch() {
  setQuery(query.value)
}

function onSelect(id: string) {
  if (isDirty.value) {
    const confirmSwitch = window.confirm('You have unsaved changes. Discard and switch note?')
    if (!confirmSwitch) return
  }
  selectNote(id)
  statusMessage.value = ''
}

async function onSave() {
  const saved = await saveNote()
  statusMessage.value = saved ? 'Saved' : 'Nothing to save'
  setTimeout(() => (statusMessage.value = ''), 1200)
}

function onCreate() {
  const id = createNote()
  selectNote(id)
  statusMessage.value = 'New note created'
  setTimeout(() => (statusMessage.value = ''), 1200)
}

function onDelete() {
  if (!selectedId.value) return
  const ok = window.confirm('Delete this note? This action cannot be undone.')
  if (!ok) return
  deleteNote(selectedId.value)
  statusMessage.value = 'Note deleted'
  setTimeout(() => (statusMessage.value = ''), 1200)
}

function onDraftUpdate(payload: { title?: string; content?: string }) {
  updateDraft(payload)
}

function handleKeydown(e: KeyboardEvent) {
  const isSave = (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')
  if (isSave) {
    e.preventDefault()
    onSave()
  }
}

onMounted(() => {
  loadFromStorage()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(59,130,246,0.08), #f9fafb 35%);
}
.container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.sidebar {
  background: var(--surface);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  height: calc(100vh - 120px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
}

.search-bar {
  padding: 8px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 8px;
}
.search-bar input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: white;
  color: var(--text);
}
.search-bar input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.editor-area {
  background: var(--surface);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-left: 16px;
  height: calc(100vh - 120px);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.empty, .empty-state {
  margin: 16px;
  text-align: center;
  color: #6b7280;
}
.empty-state h2 {
  margin-bottom: 8px;
  color: var(--text);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.05s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  font-weight: 600;
}
.btn:active { transform: translateY(1px); }

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { background: #1d4ed8; }

:root, :host {
  --primary: #2563EB;
  --secondary: #F59E0B;
  --error: #EF4444;
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
}

@media (max-width: 960px) {
  .container {
    grid-template-columns: 1fr;
  }
  .editor-area {
    margin-left: 0;
    margin-top: 12px;
    height: auto;
    min-height: 60vh;
  }
  .sidebar {
    height: auto;
  }
}
</style>
