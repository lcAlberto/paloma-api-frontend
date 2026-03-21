import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Pagination} from "~/types/PaginationInterface";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

interface Animal {
  id: number;
  name: string;
  species: string;
}

interface Breed {
  id: number;
  name: string;
}

interface AnimalFilters {
  identifier: string | null,
  breed: string | number | null
}

interface LoadingState {
  fetched: boolean,
  fetchingAnimal: boolean,
  fetchingParents: boolean,
  fetchingBreeds: boolean,
  fetchingClassifications: boolean,
  fetchingStatus: boolean,
  fetchingAnimalStatus: boolean,
  creatingAnimal: boolean,
  editingAnimal: boolean,
  deletingAnimal: boolean,
}

export const useAnimalStore = defineStore('animal', () => {
  const animals = ref<Animal[]>([]);
  const animal = ref<Animal | null>(null);
  const mothers = ref<Animal[]>([]);
  const fathers = ref<Animal[]>([]);
  const breeds = ref<Breed[]>([]);
  const classifications = ref<Breed[]>([]);
  const animalStatus = ref<Breed[]>([]);

  const emptyPagination: Pagination = {} as Pagination;

  const animalsPagination = ref<Pagination>({...emptyPagination});
  const mothersPagination = ref<Pagination>({...emptyPagination});
  const fathersPagination = ref<Pagination>({...emptyPagination});
  const breedsPagination = ref<Pagination>({...emptyPagination});
  const animalStatusPagination = ref<Pagination>({...emptyPagination});
  const classificationPagination = ref<Pagination>({...emptyPagination});

  const loading = ref<LoadingState>({
    fetched: false,
    fetchingAnimal: false,
    fetchingParents: false,
    fetchingBreeds: false,
    fetchingClassifications: false,
    fetchingStatus: false,
    fetchingAnimalStatus: false,
    creatingAnimal: false,
    editingAnimal: false,
    deletingAnimal: false,
  });

  const filters = ref<AnimalFilters>({} as AnimalFilters);
  const formErrors = ref<Record<string, string[]>>({});

  const animalCount = computed(() => animals.value.length);

  async function fetchAnimals(params: Record<string, any> = {}) {
    const uiStore = useUiStore();
    try {
      loading.value.fetched = true;
      const {$api} = useNuxtApp();

      const authStore = useAuthStore();
      params.farm = authStore.currentFarm.id;

      const response = await $api('/animals/', {
        method: 'GET',
        params: {...params},
      });

      animals.value = response.results;
      animalsPagination.value = response.pagination;
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch animals.', title: 'Error.', delay: 5000});
      console.error('Error fetching animals:', error);
    } finally {
      loading.value.fetched = false;
    }
  }

  async function fetchParents(option: 'female' | 'male') {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingParents = true;
      const {$api} = useNuxtApp();

      const response = await $api(`/parents/`, {
        method: 'GET',
        params: {sex: option}
      });

      if (option === 'female') {
        mothers.value = response.results;
        mothersPagination.value = response.pagination;
      } else {
        fathers.value = response.results;
        fathersPagination.value = response.pagination;
      }
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch parents.', title: 'Error.', delay: 5000});
      console.error('Error fetching parents:', error);
    } finally {
      loading.value.fetchingParents = false;
    }
  }

  async function fetchBreeds() {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingBreeds = true;
      const {$api} = useNuxtApp();

      const response = await $api('/breeds/', {
        method: 'GET',
        params: {
          page: breedsPagination.value.current_page,
          pageSize: breedsPagination.value.total_count,
        }
      });

      breeds.value = response.results;
      breedsPagination.value = response.pagination;
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch breeds.', title: 'Error.', delay: 5000});
      console.error('Error fetching breeds:', error);
      loading.value.fetched = false;
    } finally {
      loading.value.fetchingBreeds = false
    }
  }

  async function fetchClassifications() {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingClassifications = true;
      const {$api} = useNuxtApp();

      // Ajuste no params para seguir a sugestão de correção da action anterior
      const response = await $api('/classifications/', {
        method: 'GET',
        params: {
          page: classificationPagination.value.current_page,
          pageSize: classificationPagination.value.total_count,
        }
      });

      classifications.value = response.results;
      classificationPagination.value = response.pagination;
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch classifications.', title: 'Error.', delay: 5000});
      console.error('Error fetching classifications:', error);
      loading.value.fetched = false;
    } finally {
      loading.value.fetchingClassifications = false
    }
  }

  async function fetchAnimalStatus() {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingAnimalStatus = true;
      const {$api} = useNuxtApp();

      const response = await $api('/statuses/', {
        method: 'GET',
        params: {
          page: animalStatusPagination.value.current_page,
          pageSize: animalStatusPagination.value.total_count,
        }
      });

      animalStatus.value = response.results;
      animalStatusPagination.value = response.pagination;
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch animal status.', title: 'Error.', delay: 5000});
      console.error('Error fetching animal status:', error);
      loading.value.fetched = false;
    } finally {
      loading.value.fetchingAnimalStatus = false
    }
  }

  async function createAnimal(form: AnimalFormInterface) {
    console.log('createAnimal', form);
    const uiStore = useUiStore();
    try {
      loading.value.creatingAnimal = true
      const {$api} = useNuxtApp();
      const authStore = useAuthStore();

      return await $api('/animals/', {
        method: 'POST',
        body: {...form, farm_id: authStore.currentFarm?.id}
      })
    } catch (error) {
      console.error(error);
      if (error && (error as any).response && (error as any).response.status === 400) {
        const errorData = (error as any).response._data || (error as any).data;
        formErrors.value = errorData; // Atribuição ao ref
        uiStore.setToast({
          type: 'error',
          message: 'Verifique os erros no formulário.',
          title: 'Falha na Validação.',
          delay: 5000
        });
        return false;
      } else {
        uiStore.setToast({type: 'error', message: 'Failed to create animal.', title: 'Error.', delay: 5000});
      }
    } finally {
      loading.value.creatingAnimal = false
    }
  }

  async function editAnimal(id: string | number, form: AnimalFormInterface) {
    const uiStore = useUiStore();
    try {
      loading.value.creatingAnimal = true
      const {$api} = useNuxtApp();
      const authStore = useAuthStore();
      form.farm_id = authStore.currentFarm?.id

      return await $api(`/animals/${id}/`, {
        method: 'PUT',
        body: {...form}
      })
    } catch (error) {
      if (error && (error as any).response && (error as any).response.status === 400) {
        const errorData = (error as any).response._data || (error as any).data;
        formErrors.value = errorData;
        uiStore.setToast({
          type: 'error',
          message: 'Verifique os erros no formulário.',
          title: 'Falha na Validação.',
          delay: 5000
        });
        return false;
      } else {
        uiStore.setToast({type: 'error', message: 'Failed to update animal.', title: 'Error.', delay: 5000});
      }
    } finally {
      loading.value.creatingAnimal = false
    }
  }

  async function fetchAnimal(id: number | string | null) {
    const uiStore = useUiStore();
    try {
      if (!id)
        return
      loading.value.fetchingAnimal = true
      const {$api} = useNuxtApp();

      animal.value = await $api(`/animals/${id}`, {
        method: 'GET',
      });

    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to fetch animal details.', title: 'Error.', delay: 5000});
      console.log('Error fetching animal', error);
    } finally {
      loading.value.fetchingAnimal = false
    }
  }

  async function destroyAnimal(id: number) {
    const uiStore = useUiStore();
    try {
      const {$api} = useNuxtApp();

      await $api(`/animals/${id}/`, {
        method: 'DELETE',
      });

      // Modificação do state via .value
      animals.value = animals.value.filter(a => a.id !== id);
      uiStore.setToast({type: 'success', message: 'Animal deleted successfully.', title: 'Success.', delay: 5000});
    } catch (error) {
      uiStore.setToast({type: 'error', message: 'Failed to delete animal.', title: 'Error.', delay: 5000});
      console.error('Error deleting animal:', error);
    }
  }

  // 4. RETORNO (Exponha tudo que deve ser público: state, getters e actions)
  return {
    animals,
    animal,
    mothers,
    fathers,
    breeds,
    classifications,
    animalStatus,
    animalsPagination,
    mothersPagination,
    fathersPagination,
    breedsPagination,
    animalStatusPagination,
    classificationPagination,
    loading,
    filters,
    formErrors,

    animalCount,

    fetchAnimals,
    fetchParents,
    fetchBreeds,
    fetchClassifications,
    fetchAnimalStatus,
    createAnimal,
    editAnimal,
    fetchAnimal,
    destroyAnimal,
  };
});