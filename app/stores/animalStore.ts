import {defineStore} from 'pinia';

export const useAnimalStore = defineStore('animal', {
  state: () => ({
    animals: [] as Array<{ id: number; name: string; species: string }>,
    totalCount: 0,
    breeds: [] as Array<{ id: number; name: string }>,
    loading: {
      fetched: false,
    }
  }),
  getters: {
    animalCount: (state) => state.animals.length,
  },
  actions: {
    async fetchAnimals(params = {}) {
      try {
        this.loading.fetched = true;
        const {$api} = useNuxtApp();

        const response = await $api('/animals/', {
          method: 'GET',
          params: {...params},
        });

        this.animals = response.results;
        this.totalCount = response.count;
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        this.loading.fetched = false;
      }
    },
    async fetchBreeds() {
      try {
        const {$api} = useNuxtApp();

        const response = await $api('/breeds/', {
          method: 'GET',
        });

        this.breeds = response.results;
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    },
    async destroyAnimal(id: number) {
      try {
        const {$api} = useNuxtApp();

        await $api(`/animals/${id}/`, {
          method: 'DELETE',
        });

        this.animals = this.animals.filter(animal => animal.id !== id);
        this.totalCount -= 1;
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  },
});