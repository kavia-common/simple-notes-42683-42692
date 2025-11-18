<template>
  <header class="header">
    <div class="title">
      <span class="logo-dot" />
      <h1>Simple Notes</h1>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" @click="$emit('save')" :disabled="!selectedNote">
        Save
      </button>
      <button class="btn btn-primary" @click="$emit('create')">
        New note
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
// Props show context (selected note) to enable Save availability
defineProps<{
  selectedNote?: { id: string } | null
}>()

defineEmits<{
  (e: 'create'): void
  (e: 'save'): void
}>()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(1.2) blur(8px);
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.72));
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
}
h1 {
  font-size: 18px;
  margin: 0;
  color: var(--text);
}

.actions { display: flex; gap: 10px; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.05s ease, background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  font-weight: 600;
}
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { background: #1d4ed8; }

.btn-secondary {
  background: #f3f4f6;
  color: var(--text);
  border: 1px solid #e5e7eb;
}
.btn-secondary:hover { background: #e5e7eb; }
</style>
