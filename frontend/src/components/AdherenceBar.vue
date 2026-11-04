<script setup>
// Weekly plan adherence (US-08): a bar and "2 of 3 workouts (67 %)"
defineProps({
  adherence: { type: Object, required: true },
});
</script>

<template>
  <span v-if="adherence.percent === null" class="muted">No active plan</span>
  <span v-else class="adherence">
    <span class="bar"><i :style="{ width: `${adherence.percent}%` }"></i></span>
    {{ adherence.logged }} of {{ adherence.planned }} workouts ({{ adherence.percent }} %)
  </span>
</template>

<style scoped>
.adherence {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.bar {
  display: inline-block;
  width: 120px;
  height: 12px;
  border: 1.5px solid #555;
  background: #fff;
}
.bar i {
  display: block;
  height: 100%;
  background: #888;
}
.muted {
  color: #777;
}
</style>
