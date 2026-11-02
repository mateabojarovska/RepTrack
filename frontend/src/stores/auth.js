import { defineStore } from 'pinia';
import api from '../api/client.js';

// The start page of each role
export const HOME_BY_ROLE = {
  Client: '/client',
  Trainer: '/trainer',
  Admin: '/admin',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.user),
    homePath: (state) => HOME_BY_ROLE[state.user?.role] || '/login',
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
    },

    // After a page reload: load the user that belongs to the saved token
    async loadUser() {
      if (!this.token || this.user) return;
      try {
        const { data } = await api.get('/auth/me');
        this.user = data;
      } catch {
        this.logout();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
