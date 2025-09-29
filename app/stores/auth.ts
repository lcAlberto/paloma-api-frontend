import {defineStore} from 'pinia'
import {useUiStore} from "~/stores/ui";

const accessToken = useCookie('access');
const refreshToken = useCookie('refresh');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string, farms: object },
    userTheme: 'light',
    currentFarm: {},
    token: accessToken.value,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {

    async login(user: { username: string; password: string }): Promise<string | null> {
      const uiStore = useUiStore();
      try {
        const {$api} = useNuxtApp();
        const response = await $api('/v1/users/login/', {
          method: 'POST',
          body: user,
        });

        const token = response.access as string;
        const refresh = response.refresh as string;

        this.user = response.user_data
        if (this.user?.farms && this.user?.farms.length > 0)
          this.currentFarm = this.user.farms[0]

        this.token = token;
        accessToken.value = token;
        refreshToken.value = refresh;

        console.log(token)
        uiStore.setToast({type: 'success', message: 'Wellcome!', title: 'Success.', delay: 5000});

        return token;
      } catch (error) {
        this.token = null;
        accessToken.value = null;
        refreshToken.value = null;
        uiStore.setToast({
          type: 'error',
          message: 'Login failed. Please check your credentials.',
          title: 'Login failed.',
          delay: 5000
        });
        console.error('Error during login:', error);
        return null;
      }
    },

    async logout() {
      try {
        const {$api} = useNuxtApp();
        const response = await $api('/v1/users/logout/', {
          method: 'POST',
          body: {
            refresh: refreshToken.value
          }
        });
        console.log(response);
        this.user = null
        this.token = null
        accessToken.value = null
        refreshToken.value = null
        const router = useRouter()
        router.push('/login')
      } catch (e) {
        console.error('Error to logout', e);
      }
    },
  },
  persist: true,
})