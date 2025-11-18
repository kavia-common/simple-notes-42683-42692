<template>
  <div class="app">
    <NuxtLoadingIndicator color="#2563EB" :height="3" />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Simple Notes` : 'Simple Notes'),
  meta: [
    { name: 'theme-color', content: '#2563EB' },
  ]
})
</script>

<style>
@import '~/styles/theme.css';
html, body, #__nuxt, .app {
  height: 100%;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}
</style>
