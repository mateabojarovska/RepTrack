<script setup>
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
</script>

<template>
  <h1>Welcome, {{ auth.user.firstName }}</h1>
  <p>Client home. Your active plan and workout logging will appear here.</p>
</template>
