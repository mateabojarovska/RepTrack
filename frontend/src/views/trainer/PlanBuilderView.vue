<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api, { errorMessage } from '../../api/client.js';

// Plan builder from wireframe 2 (US-04): a new plan, or an existing plan opened by id
const route = useRoute();
const router = useRouter();

const planId = computed(() => route.params.id);
const isNew = computed(() => !planId.value);

const clients = ref([]);
const exercises = ref([]);
const status = ref('Draft');
const form = ref({ clientId: '', title: '', goal: '', days: [] });
const activeDay = ref(0);
const error = ref('');
const message = ref('');
const saving = ref(false);

const editable = computed(() => status.value === 'Draft');

// Exercises grouped by muscle group for the drop-down
const exerciseGroups = computed(() => {
  const groups = {};
  for (const ex of exercises.value) {
    (groups[ex.muscleGroup] ||= []).push(ex);
  }
  return groups;
});

const emptyExercise = () => ({ exerciseId: '', targetSets: 3, targetReps: 10, targetWeightKg: '', note: '' });
const dayLetter = (index) => String.fromCharCode(65 + index);

function addDay() {
  form.value.days.push({ name: `Day ${dayLetter(form.value.days.length)}`, exercises: [emptyExercise()] });
  activeDay.value = form.value.days.length - 1;
}

function removeDay(index) {
  form.value.days.splice(index, 1);
  activeDay.value = Math.max(0, Math.min(activeDay.value, form.value.days.length - 1));
}

function addExercise() {
  form.value.days[activeDay.value].exercises.push(emptyExercise());
}

function removeExercise(index) {
  form.value.days[activeDay.value].exercises.splice(index, 1);
}

// The plan from the API in the shape of the form
function fillForm(plan) {
  status.value = plan.status;
  form.value = {
    clientId: plan.client.id,
    title: plan.title,
    goal: plan.goal || '',
    days: plan.days.map((day) => ({
      name: day.name,
      exercises: day.exercises.map((pe) => ({
        exerciseId: pe.exercise.id,
        targetSets: pe.targetSets,
        targetReps: pe.targetReps,
        targetWeightKg: pe.targetWeightKg ?? '',
        note: pe.note || '',
      })),
    })),
  };
  activeDay.value = 0;
}

async function save() {
  error.value = '';
  message.value = '';
  saving.value = true;
  try {
    if (isNew.value) {
      const { data } = await api.post('/plans', form.value);
      fillForm(data);
      await router.replace(`/trainer/plans/${data.id}`);
    } else {
      const { data } = await api.put(`/plans/${planId.value}`, form.value);
      fillForm(data);
    }
    message.value = 'Draft saved.';
  } catch (err) {
    error.value = errorMessage(err);
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const [clientsRes, exercisesRes] = await Promise.all([api.get('/trainer/clients'), api.get('/exercises')]);
    clients.value = clientsRes.data;
    exercises.value = exercisesRes.data;

    if (isNew.value) {
      form.value.clientId = route.query.clientId ? Number(route.query.clientId) : '';
      addDay();
    } else {
      const { data } = await api.get(`/plans/${planId.value}`);
      fillForm(data);
    }
  } catch (err) {
    error.value = errorMessage(err);
  }
});
</script>

<template>
  <p><RouterLink to="/trainer/plans">← All plans</RouterLink></p>
  <h1>
    {{ isNew ? 'New training plan' : form.title }}
    <span class="badge">{{ status }}</span>
  </h1>

  <p v-if="!editable" class="notice">Only a draft plan can be edited. This plan is {{ status.toLowerCase() }}.</p>

  <form class="builder" @submit.prevent="save">
    <fieldset :disabled="!editable">
      <div class="row">
        <label for="client">Client</label>
        <select id="client" v-model="form.clientId" :disabled="!isNew" required>
          <option value="" disabled>Choose a client</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.firstName }} {{ c.lastName }}</option>
        </select>
      </div>
      <div class="row">
        <label for="title">Title</label>
        <input id="title" v-model="form.title" required />
      </div>
      <div class="row">
        <label for="goal">Goal</label>
        <input id="goal" v-model="form.goal" />
      </div>

      <h2>Training days</h2>
      <div class="tabs">
        <button
          v-for="(day, d) in form.days"
          :key="d"
          type="button"
          class="tab"
          :class="{ active: d === activeDay }"
          @click="activeDay = d"
        >
          {{ day.name || `Day ${d + 1}` }}
        </button>
        <button v-if="editable" type="button" class="tab" @click="addDay">+ Add day</button>
      </div>

      <div v-if="form.days[activeDay]" class="card day">
        <div class="row">
          <label for="day-name">Day name</label>
          <input id="day-name" v-model="form.days[activeDay].name" required />
          <button v-if="editable && form.days.length > 1" type="button" class="btn" @click="removeDay(activeDay)">
            Remove day
          </button>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (kg)</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ex, e) in form.days[activeDay].exercises" :key="e">
              <td>{{ e + 1 }}</td>
              <td>
                <select v-model="ex.exerciseId" required>
                  <option value="" disabled>Choose an exercise</option>
                  <optgroup v-for="(list, group) in exerciseGroups" :key="group" :label="group">
                    <option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </optgroup>
                </select>
              </td>
              <td><input v-model.number="ex.targetSets" class="num" type="number" min="1" step="1" required /></td>
              <td><input v-model.number="ex.targetReps" class="num" type="number" min="1" step="1" required /></td>
              <td><input v-model="ex.targetWeightKg" class="num" type="number" min="0" step="0.5" placeholder="–" /></td>
              <td><input v-model="ex.note" /></td>
              <td>
                <button
                  v-if="editable && form.days[activeDay].exercises.length > 1"
                  type="button"
                  class="remove"
                  title="Remove exercise"
                  @click="removeExercise(e)"
                >
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button v-if="editable" type="button" class="link" @click="addExercise">+ Add exercise from catalogue</button>
      </div>
    </fieldset>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="message" class="success">{{ message }}</p>

    <div v-if="editable" class="actions">
      <button class="btn" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save draft' }}</button>
    </div>
  </form>
</template>

<style scoped>
fieldset {
  border: none;
  margin: 0;
  padding: 0;
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
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tab {
  font: inherit;
  padding: 6px 12px;
  border: 1.5px solid #777;
  border-bottom: none;
  background: #f1f1f1;
  cursor: pointer;
}
.tab.active {
  background: #fff;
  font-weight: bold;
}
.day {
  margin-top: 0;
}
.num {
  width: 80px;
}
.remove {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}
.link {
  border: none;
  background: none;
  color: #555;
  padding: 8px 0 0;
  cursor: pointer;
  font: inherit;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.notice {
  background: #f1f1f1;
  border: 1.5px solid #999;
  padding: 8px 12px;
}
</style>
