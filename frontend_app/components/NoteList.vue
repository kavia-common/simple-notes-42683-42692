<template>
  <div class="list" role="listbox" :aria-activedescendant="selectedId || undefined">
    <div
      v-for="n in notes"
      :key="n.id"
      class="item"
      :class="{ active: n.id === selectedId }"
      role="option"
      :aria-selected="n.id === selectedId"
      @click="$emit('select', n.id)"
    >
      <div class="row">
        <div class="title">{{ n.title || 'Untitled' }}</div>
        <div class="meta">{{ formatDate(n.updatedAt || n.createdAt) }}</div>
      </div>
      <div class="preview">{{ n.content?.slice(0, 120) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt?: number
}

defineProps<{
  notes: Note[]
  selectedId?: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

function formatDate(ts: number) {
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch {
    return ''
  }
}
</script>

<style scoped>
.list {
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  flex: 1;
}

.item {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-xs);
}
.item:hover {
  border-color: #d1d5db;
  box-shadow: var(--shadow-sm);
}
.item.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.title {
  font-weight: 700;
  color: var(--text);
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
}
.preview {
  margin-top: 4px;
  font-size: 13px;
  color: #4b5563;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
