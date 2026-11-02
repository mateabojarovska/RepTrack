<script setup>
// Read-only view of a plan's training days and exercises
defineProps({
  plan: { type: Object, required: true },
});

function target(pe) {
  const weight = pe.targetWeightKg === null ? 'bodyweight' : `${pe.targetWeightKg} kg`;
  return `${pe.targetSets} × ${pe.targetReps} @ ${weight}`;
}
</script>

<template>
  <div v-for="day in plan.days" :key="day.id" class="card plan-day">
    <h3>{{ day.name }}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Target</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pe in day.exercises" :key="pe.id">
          <td>{{ pe.exercise.name }}</td>
          <td>{{ target(pe) }}</td>
          <td>{{ pe.note || '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.plan-day {
  margin-bottom: 12px;
}
.plan-day h3 {
  margin-top: 0;
}
</style>
