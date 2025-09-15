import {defineStore} from 'pinia';

interface Pagination {
  current_page: number,
  per_page: number,
  total_count: number,
  next: number | null,
  previous: number | null,
  total_pages: number | null
}

interface AnimalFilters {
  identifier: string | null,
  breed: string | number | null
}

export const useAnimalStore = defineStore('animal', {
  state: () => ({
    animals: [] as Array<{ id: number; name: string; species: string }>,
    animalsPagination: {} as Pagination,
    breeds: [] as Array<{ id: number; name: string }>,
    breedsPagination: {} as Pagination,
    loading: {
      fetched: false,
      fetchingBreeds: false,
    },
    filters: {} as AnimalFilters
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
        this.animalsPagination = response.pagination;
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        this.loading.fetched = false;
      }
    },
    async fetchBreeds() {
      try {
        this.loading.fetchingBreeds = true;
        const {$api} = useNuxtApp();

        const params = `?page=${this.breedsPagination.current_page}&pageSize=${this.breedsPagination.total_count}`;
        const response = await $api('/breeds/', {
          method: 'GET',
          params: {params}
        });

        this.breeds = response.results;
        this.breedsPagination = response.pagination;
      } catch (error) {
        console.error('Error fetching breeds:', error);
        this.loading.fetched = false;
      } finally {
        this.loading.fetchingBreeds = false
      }
    },
    async destroyAnimal(id: number) {
      try {
        const {$api} = useNuxtApp();

        await $api(`/animals/${id}/`, {
          method: 'DELETE',
        });

        this.animals = this.animals.filter(animal => animal.id !== id);
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  },
});