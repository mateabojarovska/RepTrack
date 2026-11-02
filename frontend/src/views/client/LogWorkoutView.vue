<script setup>
import { ref, computed, onMounted } from 'vue';
import api, { errorMessage } from '../../api/client.js';

// "Log workout" from wireframe 1 (US-06), built for a phone screen in the gym
const plan = ref(null);
const noPlan = ref(false);
const dayId = ref('');
const performedOn = ref(new Date().toLocaleDateString('en-CA')); // today as YYYY-MM-DD
const note = ref('');
const entries = ref([]); // one entry per exercise of the chosen day, with its set rows
const error = ref('');
const saved = ref(null);
const saving = ref(false);

const day = computed(() => plan.value?.days.find((d) => d.id === dayId.value));

function targetText(pe) {
  const weight = pe.targetWeightKg === null ? 'bodyweight' : `${pe.targetWeightKg} kg`;
  return `${pe.targetSets} × ${pe.targetReps} @ ${weight}`;
}

// Empty set rows for the chosen day; the planned values are shown as placeholders
function prepareDay() {
  saved.value = null;
  error.value = '';
  entries.value = (day.value?.exercises || []).map((pe) => ({
    planExercise: pe,
    sets: Array.from({ length: pe.targetSets }, () => ({ reps: '', weightKg: '' })),
  }));
}

function addSet(entry) {
  entry.sets.push({ reps: '', weightKg: '' });
}

async function save() {
  error.value = '';
  saved.value = null;

  // Only rows with repetitions filled in are sent; an empty weight counts as 0 (bodyweight)
  const sets = entries.value.flatMap((entry) =>
    entry.sets
      .filter((s) => s.reps !== '' && s.reps !== null)
      .map((s) => ({ exerciseId: entry.planExercise.exercise.id, reps: s.reps, weightKg: s.weightKg === '' ? 0 : s.weightKg })),
  );
  if (sets.length === 0) {
    error.value = 'Log at least one set';
    return;
  }

  saving.value = true;
  try {
    const { data } = await api.post('/workouts', {
      planDayId: dayId.value,
      performedOn: performedOn.value,
      clientNote: note.value,
      sets,
    });
    // Empty the form for the next workout and show what was saved
    note.value = '';
    prepareDay();
    saved.value = data;
    window.scrollTo(0, 0);
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    plan.value = (await api.get('/me/active-plan')).data;
    dayId.value = plan.value.days[0]?.id || '';
    prepareDay();
  } catch (err) {
    if (err.response?.status === 404) noPlan.value = true;
    else error.value = errorMessage(err);
  }
});
</script>

<template>
  <div class="log">
    <h1>Log workout</h1>

    <p v-if="noPlan">You do not have an active plan yet</p>

    <p v-if="saved" class="success">
      Workout saved: {{ saved.planDay.name }}, {{ saved.performedOn }}, {{ saved.sets.length }} sets.
    </p>

    <form v-if="plan" @submit.prevent="save">
      <div class="row">
        <label for="day">Training day</label>
        <select id="day" v-model="dayId" @change="prepareDay">
          <option v-for="d in plan.days" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </div>
      <div class="row">
        <label for="date">Date</label>
        <input id="date" v-model="performedOn" type="date" required />
      </div>

      <div v-for="entry in entries" :key="entry.planExercise.id" class="card exercise">
        <h2>{{ entry.planExercise.exercise.name }}</h2>
        <p class="plan">Plan: {{ targetText(entry.planExercise) }}</p>
        <p v-if="entry.planExercise.note" class="plan">Note: {{ entry.planExercise.note }}</p>
        <table class="table">
          <thead>
            <tr>
              <th>Set</th>
              <th>Reps</th>
              <th>Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in entry.sets" :key="i">
              <td>{{ i + 1 }}</td>
              <td>
                <input v-model.number="s.reps" type="number" min="1" step="1" inputmode="numeric" :placeholder="entry.planExercise.targetReps" />
              </td>
              <td>
                <input
                  v-model.number="s.weightKg"
                  type="number"
                  min="0"
                  step="0.5"
                  inputmode="decimal"
                  :placeholder="entry.planExercise.targetWeightKg ?? 0"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="link" @click="addSet(entry)">+ Add set</button>
      </div>

      <label for="note">Note (how did the workout feel?)</label>
      <textarea id="note" v-model="note" rows="3"></textarea>

      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn primary full" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save workout' }}
      </button>
    </form>

    <p v-else-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.log {
  max-width: 480px;
  margin: 0 auto;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.row label {
  width: 110px;
  flex-shrink: 0;
}
.row input,
.row select {
  flex: 1;
}
.exercise {
  margin: 14px 0;
}
.exercise h2 {
  margin: 0 0 4px;
  font-size: 18px;
}
.plan {
  color: #666;
  margin: 0 0 8px;
}
textarea {
  width: 100%;
  margin: 6px 0 12px;
}
.link {
  border: none;
  background: none;
  color: #555;
  padding: 8px 0 0;
  cursor: pointer;
  font: inherit;
}
.full {
  width: 100%;
  margin-top: 8px;
}
</style>
