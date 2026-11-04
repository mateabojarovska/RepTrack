<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api, { errorMessage } from '../../api/client.js';
import AdherenceBar from '../../components/AdherenceBar.vue';

// "Workouts to review" from wireframe 3 (US-09): list on the left, the selected workout on the right
const route = useRoute();
const router = useRouter();

const list = ref([]);
const workout = ref(null);
const feedback = ref('');
const error = ref('');
const message = ref('');
const saving = ref(false);

function formatDate(value, weekday = false) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, weekday ? { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' } : undefined);
}

function setText(values) {
  if (!values) return '—';
  return `${values.reps} × ${values.weightKg === null ? 'bodyweight' : `${values.weightKg} kg`}`;
}

async function loadList() {
  list.value = (await api.get('/reviews')).data;
}

async function loadWorkout(id) {
  workout.value = null;
  feedback.value = '';
  error.value = '';
  if (!id) return;
  try {
    workout.value = (await api.get(`/reviews/${id}`)).data;
    feedback.value = workout.value.trainerFeedback || '';
  } catch (err) {
    error.value = errorMessage(err);
  }
}

async function markReviewed() {
  error.value = '';
  message.value = '';
  saving.value = true;
  try {
    workout.value = (await api.post(`/reviews/${workout.value.id}`, { feedback: feedback.value })).data;
    message.value = 'Workout marked as reviewed. The client can now see your feedback.';
    await loadList();
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

watch(
  () => route.params.id,
  (id) => {
    message.value = '';
    loadWorkout(id);
  },
);

onMounted(async () => {
  try {
    await loadList();
    if (route.params.id) await loadWorkout(route.params.id);
    else if (list.value.length) router.replace(`/trainer/reviews/${list.value[0].id}`);
  } catch (err) {
    error.value = errorMessage(err);
  }
});
</script>

<template>
  <div class="split">
    <aside class="list">
      <div class="list-head">Workouts to review ({{ list.length }})</div>
      <RouterLink
        v-for="w in list"
        :key="w.id"
        :to="`/trainer/reviews/${w.id}`"
        class="item"
        :class="{ active: workout && workout.id === w.id }"
      >
        <strong>{{ w.client.firstName }} {{ w.client.lastName }}</strong>
        <span>{{ w.planDay.name }} · {{ formatDate(w.performedOn) }}</span>
      </RouterLink>
      <p v-if="list.length === 0" class="empty">No workouts are waiting for review.</p>
    </aside>

    <section class="detail">
      <p v-if="!workout && !error" class="empty">Choose a workout on the left.</p>
      <p v-if="error" class="error">{{ error }}</p>

      <template v-if="workout">
        <h1>
          {{ workout.client.firstName }} {{ workout.client.lastName }} – {{ workout.planDay.name }} –
          {{ formatDate(workout.performedOn, true) }}
        </h1>
        <div class="meta">
          <span>Status: <span class="badge">{{ workout.status }}</span></span>
          <span>Adherence that week: <AdherenceBar :adherence="workout.adherence" /></span>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Set</th>
              <th>Planned</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in workout.rows" :key="i">
              <td>{{ row.setNumber === 1 ? row.exercise.name : '' }}</td>
              <td>{{ row.setNumber }}</td>
              <td>{{ setText(row.planned) }}</td>
              <td>
                {{ setText(row.done) }}
                <span v-if="row.done?.isPersonalRecord" class="badge pr">★ Personal record</span>
              </td>
            </tr>
          </tbody>
        </table>

        <p><strong>Client's note:</strong> {{ workout.clientNote || '–' }}</p>

        <label for="feedback">Feedback</label>
        <textarea id="feedback" v-model="feedback" rows="4" :disabled="workout.status !== 'Logged'"></textarea>

        <p v-if="message" class="success">{{ message }}</p>
        <div v-if="workout.status === 'Logged'" class="actions">
          <button class="btn primary" :disabled="saving" @click="markReviewed">
            {{ saving ? 'Saving…' : 'Mark as reviewed' }}
          </button>
        </div>
        <p v-else class="muted">Reviewed on {{ new Date(workout.reviewedAt).toLocaleString() }}.</p>
      </template>
    </section>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  gap: 0;
  border: 2px solid #444;
  min-height: 420px;
}
.list {
  width: 280px;
  flex-shrink: 0;
  border-right: 2px solid #444;
}
.list-head {
  padding: 10px 14px;
  background: #eee;
  font-weight: bold;
  border-bottom: 1.5px solid #999;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-bottom: 1.5px solid #999;
  color: inherit;
  text-decoration: none;
}
.item span {
  color: #666;
  font-size: 14px;
}
.item.active {
  background: #e3e3e3;
}
.detail {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}
.detail h1 {
  font-size: 22px;
  margin-top: 0;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 12px;
}
textarea {
  width: 100%;
  margin: 6px 0 12px;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.empty,
.muted {
  color: #666;
  padding: 0 14px;
}
@media (max-width: 760px) {
  .split {
    flex-direction: column;
  }
  .list {
    width: auto;
    border-right: none;
    border-bottom: 2px solid #444;
  }
}
</style>
