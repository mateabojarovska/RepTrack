<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api, { errorMessage } from '../../api/client.js';
import PlanDetails from '../../components/PlanDetails.vue';

// One of the client's plans, read-only (also archived plans, US-05)
const route = useRoute();
const plan = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    plan.value = (await api.get(`/me/plans/${route.params.id}`)).data;
  } catch (err) {
    error.value = errorMessage(err);
  }
});
</script>

<template>
  <p><RouterLink to="/client">← My plan</RouterLink></p>
  <p v-if="error" class="error">{{ error }}</p>
  <template v-if="plan">
    <h1>{{ plan.title }} <span class="badge">{{ plan.status }}</span></h1>
    <p v-if="plan.goal">Goal: {{ plan.goal }}</p>
    <PlanDetails :plan="plan" />
  </template>
</template>
