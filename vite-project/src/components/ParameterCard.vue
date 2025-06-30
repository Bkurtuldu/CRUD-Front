<template>
  <div :class="['p-4 rounded border border', themeClass]">
    <p><strong>Parameter Key:</strong> {{ param.key }}</p>
    <p><strong>Value:</strong> {{ param.value }}</p>
    <p><strong>Description:</strong> {{ param.description }}</p>
    <p><strong>Create Date:</strong> {{ param.created }}</p>
    <div class="mt-2 flex gap-2">
      <button class="bg-blue-500 px-3 py-1 rounded" @click="$emit('edit', param)">Edit</button>
      <button class="bg-red-500 px-3 py-1 rounded" @click="$emit('delete', param)">Del</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  param: {
    key: string
    value: string | number
    description: string
    created: string
  }
}>()

const themeClass = computed(() =>
  localStorage.getItem('theme') === 'dark'
    ? 'bg-gray-900 text-white'
    : 'bg-white text-gray-900'
)
</script>
