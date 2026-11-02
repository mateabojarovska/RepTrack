<script setup>
import { ref, onMounted } from 'vue';
import api, { errorMessage } from '../../api/client.js';

const plans = ref([]);
const error = ref('');

const STATUS_NAMES = { Draft: 'Draft', Active: 'Active', Archived: 'Archived' };

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '–';
}

onMounted(async () => {
  try {
    const { data } = await api.get('/plans');
    plans.value = data;
  } catch (err) {
    error.value = errorMessage(err);
  }
});
</script>

<template>
  <div class="heading">
    <h1>Training plans</h1>
    <RouterLink class="btn primary" to="/trainer/plans/new">New plan</RouterLink>
  </div>

  <p v-if="error" class="error">{{ error }}</p>
  <p v-else-if="plans.length === 0">You have no plans yet.</p>

  <table v-else class="table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Client</th>
        <th>Status</th>
        <th>Created</th>
        <th>Published</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="plan in plans" :key="plan.id">
        <td>{{ plan.title }}</td>
        <td>{{ plan.client.firstName }} {{ plan.client.lastName }}</td>
        <td><span class="badge">{{ STATUS_NAMES[plan.status] }}</span></td>
        <td>{{ formatDate(plan.createdAt) }}</td>
        <td>{{ formatDate(plan.publishedAt) }}</td>
        <td>
          <RouterLink :to="`/trainer/plans/${plan.id}`">{{ plan.status === 'Draft' ? 'Edit' : 'View' }}</RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
