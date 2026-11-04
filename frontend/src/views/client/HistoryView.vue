<script setup>
import { ref, onMounted } from 'vue';
import api, { errorMessage } from '../../api/client.js';

// The client's workout history with the trainer's feedback (US-10).
// A workout that is not reviewed yet can still be corrected (US-06).
const workouts = ref([]);
const error = ref('');
const editingId = ref(null);
const draft = ref(null);
const editError = ref('');
const saving = ref(false);

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' });
}

async function load() {
  try {
    workouts.value = (await api.get('/me/workouts')).data;
  } catch (err) {
    error.value = errorMessage(err);
  }
}

function startEdit(w) {
  editingId.value = w.id;
  editError.value = '';
  draft.value = {
    clientNote: w.clientNote || '',
    sets: w.sets.map((s) => ({ exerciseId: s.exercise.id, name: s.exercise.name, setNumber: s.setNumber, reps: s.reps, weightKg: s.weightKg })),
  };
}

function cancelEdit() {
  editingId.value = null;
  draft.value = null;
}

async function saveEdit(w) {
  editError.value = '';
  saving.value = true;
  try {
    const { data } = await api.put(`/workouts/${w.id}`, {
      performedOn: w.performedOn,
      clientNote: draft.value.clientNote,
      sets: draft.value.sets.map((s) => ({ exerciseId: s.exerciseId, reps: s.reps, weightKg: s.weightKg })),
    });
    const index = workouts.value.findIndex((x) => x.id === w.id);
    workouts.value[index] = data;
    cancelEdit();
  } catch (err) {
    editError.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <h1>Workout history</h1>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-else-if="workouts.length === 0">You have not logged any workouts yet.</p>

  <article v-for="w in workouts" :key="w.id" class="card workout">
    <header class="head">
      <h2>{{ formatDate(w.performedOn) }} – {{ w.planDay.name }}</h2>
      <span class="badge">{{ w.status === 'Reviewed' ? 'Reviewed' : 'Waiting for review' }}</span>
    </header>

    <!-- Read-only sets -->
    <table v-if="editingId !== w.id" class="table">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Set</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in w.sets" :key="s.id">
          <td>{{ s.setNumber === 1 ? s.exercise.name : '' }}</td>
          <td>{{ s.setNumber }}</td>
          <td>
            {{ s.reps }} × {{ s.weightKg }} kg
            <span v-if="s.isPersonalRecord" class="badge pr">★ Personal record</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Correcting a workout that is not reviewed yet -->
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in draft.sets" :key="i">
            <td>{{ s.name }}</td>
            <td>{{ s.setNumber }}</td>
            <td><input v-model.number="s.reps" type="number" min="1" step="1" /></td>
            <td><input v-model.number="s.weightKg" type="number" min="0" step="0.5" /></td>
          </tr>
        </tbody>
      </table>
      <label class="note-edit">
        Note
        <textarea v-model="draft.clientNote" rows="2"></textarea>
      </label>
      <p v-if="editError" class="error">{{ editError }}</p>
      <div class="actions">
        <button class="btn" type="button" @click="cancelEdit">Cancel</button>
        <button class="btn primary" type="button" :disabled="saving" @click="saveEdit(w)">
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </div>

    <p v-if="w.clientNote && editingId !== w.id"><strong>My note:</strong> {{ w.clientNote }}</p>

    <div v-if="w.status === 'Reviewed'" class="feedback">
      <strong>Trainer's feedback</strong>
      <span class="date">reviewed {{ new Date(w.reviewedAt).toLocaleDateString() }}</span>
      <p>{{ w.trainerFeedback }}</p>
    </div>
    <p v-else-if="editingId !== w.id" class="waiting">
      Waiting for review.
      <button class="link" type="button" @click="startEdit(w)">Correct this workout</button>
    </p>
  </article>
</template>

<style scoped>
.workout {
  margin-bottom: 16px;
}
.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.head h2 {
  margin: 0;
  font-size: 18px;
}
.feedback {
  background: #f1f1f1;
  border: 1.5px solid #999;
  padding: 10px 12px;
  margin-top: 12px;
}
.feedback p {
  margin: 6px 0 0;
}
.date {
  color: #666;
  font-size: 13px;
  margin-left: 8px;
}
.waiting {
  color: #555;
}
.link {
  border: none;
  background: none;
  text-decoration: underline;
  color: #333;
  cursor: pointer;
  font: inherit;
  margin-left: 8px;
}
.note-edit {
  margin-top: 10px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
</style>
