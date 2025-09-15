import {$fetch} from 'ofetch';
import {useAuthStore} from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: runtimeConfig.public.apiBaseUrl,

    async onRequest({options}) {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    },

    async onResponseError({response}) {
      if (response && response.status === 401) {
        console.error('Requisição falhou com status 401 - Unauthorized.');
        const authStore = useAuthStore();
        authStore.logout();
        navigateTo('/login');
      }
    },
  });

  return {
    provide: {
      api: api,
    },
  };
});