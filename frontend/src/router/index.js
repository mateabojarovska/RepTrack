import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import LoginView from '../views/LoginView.vue';
import ClientHomeView from '../views/client/ClientHomeView.vue';
import TrainerHomeView from '../views/trainer/TrainerHomeView.vue';
import AdminHomeView from '../views/admin/AdminHomeView.vue';
import PlanListView from '../views/trainer/PlanListView.vue';
import ClientsView from '../views/trainer/ClientsView.vue';
import ReviewView from '../views/trainer/ReviewView.vue';
import PlanBuilderView from '../views/trainer/PlanBuilderView.vue';
import ClientPlanView from '../views/client/ClientPlanView.vue';
import LogWorkoutView from '../views/client/LogWorkoutView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // The login page sends logged-in users on to their own start page
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/client', name: 'client-home', component: ClientHomeView, meta: { roles: ['Client'] } },
    { path: '/client/log', name: 'client-log', component: LogWorkoutView, meta: { roles: ['Client'] } },
    { path: '/client/plans/:id', name: 'client-plan', component: ClientPlanView, meta: { roles: ['Client'] } },
    { path: '/trainer', name: 'trainer-home', component: TrainerHomeView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/clients', name: 'trainer-clients', component: ClientsView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/reviews', name: 'trainer-reviews', component: ReviewView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/reviews/:id', name: 'trainer-review', component: ReviewView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/plans', name: 'trainer-plans', component: PlanListView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/plans/new', name: 'trainer-plan-new', component: PlanBuilderView, meta: { roles: ['Trainer'] } },
    { path: '/trainer/plans/:id', name: 'trainer-plan', component: PlanBuilderView, meta: { roles: ['Trainer'] } },
    { path: '/admin', name: 'admin-home', component: AdminHomeView, meta: { roles: ['Admin'] } },
    // Any other address leads to the user's own start page
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

// Route guard: only logged-in users, and only the pages of their own role
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.loadUser();

  if (to.meta.public) {
    return auth.isLoggedIn ? auth.homePath : true;
  }
  if (!auth.isLoggedIn) {
    return '/login';
  }
  if (!to.meta.roles || !to.meta.roles.includes(auth.user.role)) {
    return auth.homePath;
  }
  return true;
});

export default router;
