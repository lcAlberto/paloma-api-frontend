import {defineStore} from "pinia";
import type {Pagination} from "~/types/PaginationInterface";
import type {ReproductiveCycleFormInterface} from "~/types/ReproductiveCycleFormInterface";

export const useReproductionStore = defineStore('reproduction', {
  state: () => ({
    reproductions: [] as Array<{ id: number; type: string; date: string }>,
    reproduction: null as { id: number; type: string; date: string } | null,
    pagination: {} as Pagination,
    formErrors: {} as Record<string, string[]>,
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
      } catch (error: Response) {
        uiStore.setToast({type: 'error', message: 'Failed to fetch reproductions.', title: 'Error.', delay: 5000});
        console.log(error);
      } finally {
        this.loading.fetchingReproductions = false;
      }
    },

    async fetchReproduction(id: number | string) {
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

    async createReproduction(form: ReproductiveCycleFormInterface) {
      const uiStore = useUiStore();
      this.formErrors = {};
      try {
        this.loading.creatingReproduction = true;
        const {$api} = useNuxtApp();

        return await $api('/reproductions/', {
          method: 'POST',
          body: {...form},
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorData = error.response._data || error.data;
          this.formErrors = errorData;
          uiStore.setToast({
            type: 'error',
            message: 'Verifique os erros no formulário.',
            title: 'Falha na Validação.',
            delay: 5000
          });
          return false;
        } else {
          uiStore.setToast({type: 'error', message: 'Failed to create reproduction.', title: 'Error.', delay: 5000});
        }
      } finally {
        this.loading.creatingReproduction = false;
      }
    },

    async editReproduction(id: string | number, form: ReproductiveCycleFormInterface) {
      const uiStore = useUiStore();
      try {
        this.loading.editingReproduction = true;
        const {$api} = useNuxtApp();
        // const authStore = useAuthStore();
        // form.farm_id = authStore.currentFarm?.id;

        return await $api(`/reproductions/${id}/`, {
          method: 'PUT',
          body: {...form},
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorData = error.response._data || error.data;
          this.formErrors = errorData;
          uiStore.setToast({
            type: 'error',
            message: 'Verifique os erros no formulário.',
            title: 'Falha na Validação.',
            delay: 5000
          });
          return false;
        } else {
          uiStore.setToast({type: 'error', message: 'Failed to create reproduction.', title: 'Error.', delay: 5000});
          console.log('Error creating reproduction', error);
        }
      } finally {
        this.loading.editingReproduction = false;
      }
    },

    async fetchReproductionCycle(id: number) {
      const uiStore = useUiStore();
      try {
        this.loading.fetchingReproduction = true;
        const {$api} = useNuxtApp();
        return await $api(`/reproductions/${id}/`, {});
      } catch (error) {
        uiStore.setToast({type: 'error', message: 'Failed to fetch reproduction.', title: 'Error.', delay: 5000});
        console.log('Error fetch reproduction', error);
      } finally {
        this.loading.fetchingReproduction = false;
      }
    },

    async deleteReproduction(id: string | number) {
      const uiStore = useUiStore();
      try {
        this.loading.deletingReproduction = true;
        const {$api} = useNuxtApp();
        // const authStore = useAuthStore();
        // const params = {farm: authStore.currentFarm.id};

        return await $api(`/reproductions/${id}/`, {
          method: 'DELETE',
          // params,
        });
      } catch (error) {
        uiStore.setToast({type: 'error', message: 'Failed to delete reproduction.', title: 'Error.', delay: 5000});
        console.log('Error deleting reproduction', error);
      } finally {
        this.loading.deletingReproduction = false;
      }
    },
  }
});