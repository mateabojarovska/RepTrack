<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/client.js';

// Checks that the frontend can reach the backend
const apiStatus = ref('checking…');

onMounted(async () => {
  try {
    const { data } = await api.get('/health');
    apiStatus.value = data.status;
  } catch {
    apiStatus.value = 'not reachable';
  }
});
</script>

<template>
  <h1>RepTrack</h1>
  <p>Training plans and workout tracking for personal trainers and their clients.</p>
  <p>API status: <strong>{{ apiStatus }}</strong></p>
</template>
