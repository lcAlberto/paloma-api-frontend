import {defineStore} from 'pinia';
import type {Pagination} from "~/types/PaginationInterface";

interface AnimalFilters {
  identifier: string | null,
  breed: string | number | null
}

export const useAnimalStore = defineStore('animal', {
  state: () => ({
    animals: [] as Array<{ id: number; name: string; species: string }>,
    breeds: [] as Array<{ id: number; name: string }>,
    classifications: [] as Array<{ id: number; name: string }>,
    animalStatus: [] as Array<{ id: number; name: string }>,
    animalsPagination: {} as Pagination,
    breedsPagination: {} as Pagination,
    animalStatusPagination: {} as Pagination,
    classificationPagination: {} as Pagination,
    loading: {
      fetched: false,
      fetchingBreeds: false,
      fetchingClassifications: false,
      fetchingStatus: false,
      fetchingAnimalStatus: false,
    },
    filters: {} as AnimalFilters
  }),
  getters: {
    animalCount: (state) => state.animals.length,
  },
  actions: {
    async fetchAnimals(params: Record<string, any> = {}) {
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

    async fetchClassifications() {
      try {
        this.loading.fetchingClassifications = true;
        const {$api} = useNuxtApp();

        const params = `?page=${this.classificationPagination.current_page}&pageSize=${this.classificationPagination.total_count}`;
        const response = await $api('/classifications/', {
          method: 'GET',
          params: {params}
        });

        this.classifications = response.results;
        this.classificationPagination = response.pagination;
      } catch (error) {
        console.error('Error fetching breeds:', error);
        this.loading.fetched = false;
      } finally {
        this.loading.fetchingClassifications = false
      }
    },

    async fetchAnimalStatus() {
      try {
        this.loading.fetchingAnimalStatus = true;
        const {$api} = useNuxtApp();

        const params = `?page=${this.animalStatusPagination.current_page}&pageSize=${this.animalStatusPagination.total_count}`;
        const response = await $api('/statuses/', {
          method: 'GET',
          params: {params}
        });

        this.animalStatus = response.results;
        this.animalStatusPagination = response.pagination;
      } catch (error) {
        console.error('Error fetching breeds:', error);
        this.loading.fetched = false;
      } finally {
        this.loading.fetchingAnimalStatus = false
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