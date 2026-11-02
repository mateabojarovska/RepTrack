<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

const ROLE_NAMES = { Client: 'Client', Trainer: 'Trainer', Admin: 'Administrator' };

// Menu links of each role; later issues add more
const MENU = {
  Client: [],
  Trainer: [{ to: '/trainer/plans', label: 'Plans' }],
  Admin: [],
};

const menu = computed(() => MENU[auth.user?.role] || []);

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" :to="auth.isLoggedIn ? auth.homePath : '/login'">RepTrack</RouterLink>
    <nav v-if="auth.isLoggedIn" class="nav">
      <RouterLink v-for="item in menu" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      <span>{{ auth.user.firstName }} {{ auth.user.lastName }} ({{ ROLE_NAMES[auth.user.role] }})</span>
      <button class="btn" @click="logout">Log out</button>
    </nav>
  </header>
  <main class="page">
    <RouterView />
  </main>
</template>
