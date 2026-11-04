<script setup>
import { ref, computed, onMounted } from 'vue';
import api, { errorMessage } from '../../api/client.js';
import { useAuthStore } from '../../stores/auth.js';
import PlanDetails from '../../components/PlanDetails.vue';
import AdherenceBar from '../../components/AdherenceBar.vue';

const auth = useAuthStore();
const activePlan = ref(null);
const adherence = ref(null);
const plans = ref([]);
const error = ref('');
const loaded = ref(false);

const archivedPlans = computed(() => plans.value.filter((p) => p.status === 'Archived'));

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '–';
}

onMounted(async () => {
  try {
    const { data } = await api.get('/me/plans');
    plans.value = data;
    if (data.some((p) => p.status === 'Active')) {
      activePlan.value = (await api.get('/me/active-plan')).data;
      adherence.value = (await api.get('/me/adherence')).data;
    }
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    loaded.value = true;
  }
});
</script>

<template>
  <h1>Welcome, {{ auth.user.firstName }}</h1>
  <p v-if="error" class="error">{{ error }}</p>

  <template v-if="loaded && !error">
    <section v-if="activePlan">
      <div class="heading">
        <h2>{{ activePlan.title }} <span class="badge">Active</span></h2>
        <RouterLink class="btn primary" to="/client/log">Log workout</RouterLink>
      </div>
      <p v-if="activePlan.goal">Goal: {{ activePlan.goal }}</p>
      <p v-if="adherence">This week: <AdherenceBar :adherence="adherence" /></p>
      <PlanDetails :plan="activePlan" />
    </section>
    <p v-else>You do not have an active plan yet. Your trainer will publish one for you.</p>

    <section v-if="archivedPlans.length">
      <h2>Previous plans</h2>
      <ul>
        <li v-for="p in archivedPlans" :key="p.id">
          <RouterLink :to="`/client/plans/${p.id}`">{{ p.title }}</RouterLink>
          (archived {{ formatDate(p.archivedAt) }})
        </li>
      </ul>
    </section>
  </template>
</template>

<style scoped>
.heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
