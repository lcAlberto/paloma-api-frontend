import {defineStore} from 'pinia';
import type {Pagination} from "~/types/PaginationInterface";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

interface AnimalFilters {
  identifier: string | null,
  breed: string | number | null
}

export const useAnimalStore = defineStore('animal', {
  state: () => ({
    animals: [] as Array<{ id: number; name: string; species: string }>,
    animal: null,
    mothers: [] as Array<{ id: number; name: string; species: string }>,
    fathers: [] as Array<{ id: number; name: string; species: string }>,
    breeds: [] as Array<{ id: number; name: string }>,
    classifications: [] as Array<{ id: number; name: string }>,
    animalStatus: [] as Array<{ id: number; name: string }>,
    animalsPagination: {} as Pagination,
    mothersPagination: {} as Pagination,
    fathersPagination: {} as Pagination,
    breedsPagination: {} as Pagination,
    animalStatusPagination: {} as Pagination,
    classificationPagination: {} as Pagination,
    loading: {
      fetched: false,
      fetchingAnimal: false,
      fetchingBreeds: false,
      fetchingClassifications: false,
      fetchingStatus: false,
      fetchingAnimalStatus: false,
      creatingAnimal: false,
      editingAnimal: false,
      deletingAnimal: false,
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
        // TODO: ajustar o pre carregamento do filtro de fazendas. Fazer com que toda vez que se troque uma fazenda,
        //  se adicione na url o parâmetro. E depois observe-se esse parâmetro pra fazer o fetch toda vez que mudar
        //  a url
        const authStore = useAuthStore();
        params.farm = authStore.currentFarm.id

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

    async fetchParents(option: string) {
      try {
        this.loading.fetched = true;
        const {$api} = useNuxtApp();

        const response = await $api(`/parents/`, {
          method: 'GET',
          params: {sex: option}
        });
        if (option === 'female') {
          this.mothers = response.results;
          this.mothersPagination = response.pagination;
        } else {
          this.fathers = response.results;
          this.fathersPagination = response.pagination;
        }
      } catch (error) {
        console.error('Error fetching parents:', error);
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

    async createAnimal(form: AnimalFormInterface) {
      try {
        this.loading.creatingAnimal = true
        const {$api} = useNuxtApp();
        const authStore = useAuthStore();
        form.farm_id = authStore.currentFarm?.id

        const response = await $api('/animals/', {
          method: 'POST',
          body: {...form}
        });

        return response

      } catch (error) {
        console.log('Error creating animals', error);
      } finally {
        this.loading.creatingAnimal = false
      }
    },

    async editAnimal(id: string | number, form: AnimalFormInterface) {
      try {
        this.loading.creatingAnimal = true
        const {$api} = useNuxtApp();
        const authStore = useAuthStore();
        form.farm_id = authStore.currentFarm?.id

        const response = await $api(`/animals/${id}/`, {
          method: 'PUT',
          body: {...form}
        });

        console.log(response);

      } catch (error) {
        console.log('Error creating animals', error);
      } finally {
        this.loading.creatingAnimal = false
      }
    },

    async fetchAnimal(id: number | string | null) {
      try {
        if (!id)
          return
        this.loading.fetchingAnimal = true
        const {$api} = useNuxtApp();

        this.animal = await $api(`/animals/${id}`, {
          method: 'GET',
        });

      } catch (error) {
        console.log('Error creating animals', error);
      } finally {
        this.loading.fetchingAnimal = false
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