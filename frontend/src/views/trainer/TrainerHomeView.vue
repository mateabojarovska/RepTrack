<script setup>
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
</script>

<template>
  <h1>Welcome, {{ auth.user.firstName }}</h1>
  <p>Trainer home.</p>
  <p><RouterLink class="btn primary" to="/trainer/plans">Training plans</RouterLink></p>
</template>
