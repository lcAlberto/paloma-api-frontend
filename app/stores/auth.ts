import {defineStore} from 'pinia'

const tokenCookie = useCookie('token');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string, farms: object },
    currentFarm: {},
    token: tokenCookie.value,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {

    async login(user: { username: string; password: string }): Promise<string | null> {
      try {
        const {$api} = useNuxtApp();
        const response = await $api('/v1/users/login/', {
          method: 'POST',
          body: user,
        });

        const token = response.access as string;
        this.user = response.user_data
        if (this.user?.farms && this.user?.farms.length > 0)
          this.currentFarm = this.user.farms[0]
        this.token = token;
        tokenCookie.value = token;

        return token;
      } catch (error) {
        this.token = null;
        tokenCookie.value = null;
        console.error('Error during login:', error);
        return null;
      }
    },

    logout() {
      this.user = null
      this.token = null
    },
  },
  persist: true,
})