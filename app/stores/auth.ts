import {defineStore} from 'pinia'

const tokenCookie = useCookie('token');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string },
    token: null as null | string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {

    async login(user: { username: string; password: string }): Promise<string | null> {
      try {
        const {$api} = useNuxtApp();

        console.log(user)

        const response = await $api('/users/login/', {
          method: 'POST',
          body: user,
        });
        console.log('API Response:', response);

        this.token = response.access;
        tokenCookie.value = response.access;

        return response.access;
      } catch (error) {
        console.error('Error during login:', error);
        return null;
      }
    },

    logout() {
      this.user = null
      this.token = null
    },
  },
})