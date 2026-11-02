<script setup>
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
</script>

<template>
  <h1>Welcome, {{ auth.user.firstName }}</h1>
  <p>Administrator home.</p>
</template>
