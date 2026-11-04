<script setup>
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
</script>

<template>
  <h1>Welcome, {{ auth.user.firstName }}</h1>
  <p>Trainer home.</p>
  <p class="links">
    <RouterLink class="btn primary" to="/trainer/clients">My clients</RouterLink>
    <RouterLink class="btn" to="/trainer/plans">Training plans</RouterLink>
  </p>
</template>

<style scoped>
.links {
  display: flex;
  gap: 12px;
}
</style>
