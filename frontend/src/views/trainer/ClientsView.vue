<script setup>
import { ref, onMounted } from 'vue';
import api, { errorMessage } from '../../api/client.js';
import AdherenceBar from '../../components/AdherenceBar.vue';

// The trainer's clients with this week's plan adherence (US-08)
const clients = ref([]);
const error = ref('');

function formatDate(value) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString() : '–';
}

onMounted(async () => {
  try {
    clients.value = (await api.get('/trainer/clients')).data;
  } catch (err) {
    error.value = errorMessage(err);
  }
});
</script>

<template>
  <h1>My clients</h1>
  <p v-if="clients[0]" class="week">
    Week {{ formatDate(clients[0].adherence.weekStart) }} – {{ formatDate(clients[0].adherence.weekEnd) }}
  </p>

  <p v-if="error" class="error">{{ error }}</p>
  <p v-else-if="clients.length === 0">You have no clients yet.</p>

  <table v-else class="table">
    <thead>
      <tr>
        <th>Client</th>
        <th>Active plan</th>
        <th>Adherence this week</th>
        <th>Last workout</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in clients" :key="c.id">
        <td>{{ c.firstName }} {{ c.lastName }}</td>
        <td>{{ c.adherence.activePlan?.title || '–' }}</td>
        <td><AdherenceBar :adherence="c.adherence" /></td>
        <td>{{ formatDate(c.lastWorkoutOn) }}</td>
        <td><RouterLink :to="`/trainer/plans/new?clientId=${c.id}`">New plan</RouterLink></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.week {
  color: #555;
}
</style>
