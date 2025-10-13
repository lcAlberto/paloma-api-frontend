import {defineStore} from "pinia";
import type {Pagination} from "~/types/PaginationInterface";

export const useReproductionStore = defineStore('reproduction', {
  state: () => ({
    reproductions: [] as Array<{ id: number; type: string; date: string }>,
    reproduction: null as { id: number; type: string; date: string } | null,
    pagination: {} as Pagination,
    loading: {
      fetchingReproductions: false,
      fetchingReproduction: false,
      creatingReproduction: false,
      editingReproduction: false,
      deletingReproduction: false,
    },
  }),
  // getters: {
  //   reproductionCount: (state) => state.reproductions.length,
  // },
  actions: {
    async fetchReproductions(params: Record<string, any> = {}) {
      const uiStore = useUiStore();
      try {
        this.loading.fetchingReproductions = true;
        const {$api} = useNuxtApp();
        const authStore = useAuthStore();
        params.farm = authStore.currentFarm.id;

        const response = await $api('/reproductions/', {
          method: 'GET',
          params: {...params},
        });

        this.reproductions = response.results;
        this.pagination = response.pagination;
      } catch (error) {
        uiStore.setToast({type: 'error', message: 'Failed to fetch reproductions.', title: 'Error.', delay: 5000});
        console.log(error);
      } finally {
        this.loading.fetchingReproductions = false;
      }
    },

    async fetchReproduction(id: number) {
      const uiStore = useUiStore();
      try {
        this.loading.fetchingReproduction = true;
        const {$api} = useNuxtApp();
        const authStore = useAuthStore();
        const params = {farm: authStore.currentFarm.id};

        const response = await $api(`/reproductions/${id}/`, {
          method: 'GET',
          params,
        });

        this.reproduction = response;
      } catch (error) {
        uiStore.setToast({type: 'error', message: 'Failed to fetch reproduction.', title: 'Error.', delay: 5000});
        console.log(error);
      } finally {
        this.loading.fetchingReproduction = false;
      }
    },
  }
});