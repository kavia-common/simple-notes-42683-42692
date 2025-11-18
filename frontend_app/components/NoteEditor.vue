<template>
  <section class="wrap">
    <div class="toolbar">
      <div class="left">
        <input
          class="title"
          type="text"
          placeholder="Note title"
          v-model="local.title"
          @input="emitChange({ title: local.title })"
        />
        <span v-if="dirty" class="dirty-dot" title="Unsaved changes"></span>
      </div>
      <div class="right">
        <span class="status" :class="{ show: !!status }">{{ status }}</span>
        <button class="btn btn-secondary" @click="$emit('save')">Save</button>
        <button class="btn btn-danger" @click="$emit('delete')">Delete</button>
      </div>
    </div>

    <textarea
      class="content"
      placeholder="Write your note here..."
      v-model="local.content"
      @input="emitChange({ content: local.content })"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt?: number
}

const props = defineProps<{
  note: Note
  dirty?: boolean
  status?: string
}>()

const emit = defineEmits<{
  (e: 'update', payload: { title?: string; content?: string }): void
  (e: 'save'): void
  (e: 'delete'): void
}>()

const local = reactive({
  title: props.note?.title ?? '',
  content: props.note?.content ?? '',
})

watch(
  () => props.note,
  (n) => {
    local.title = n?.title ?? ''
    local.content = n?.content ?? ''
  },
  { immediate: true, deep: true }
)

function emitChange(payload: { title?: string; content?: string }) {
  emit('update', payload)
}
</script>

<style scoped>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.title {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.title:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.dirty-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status {
  color: #6b7280;
  font-size: 13px;
  min-width: 60px;
  opacity: 0;
  transition: opacity 0.2s ease;
  text-align: right;
}
.status.show { opacity: 1; }

.content {
  flex: 1;
  resize: none;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.content:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.05s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  font-weight: 600;
}
.btn:active { transform: translateY(1px); }

.btn-secondary {
  background: #f3f4f6;
  color: var(--text);
  border: 1px solid #e5e7eb;
}
.btn-secondary:hover { background: #e5e7eb; }

.btn-danger {
  background: var(--error);
  color: white;
}
.btn-danger:hover { background: #dc2626; }
</style>
