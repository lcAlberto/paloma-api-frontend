// store/reproductionStore.ts

import {defineStore} from "pinia";
import {ref, computed} from 'vue';
import {z} from 'zod';
import {SemenDonorSchema, type SemenDonorForm} from '~/schemas/semenDonorSchema';
import type {Pagination} from "~/types/PaginationInterface";
import type {ReproductiveCycleFormInterface} from "~/types/ReproductiveCycleFormInterface";
import type {ReproductiveCycleData} from "~/types/ReproductiveCycleData";

// Tipos de dados
interface ReproductionItem {
  id: number;
  type: string;
  date: string
}

interface SemenDonor {
  id: number;
  name: string;
  registration_number: string | null;
  breed: number; // Supondo o ID da raça
}

interface LoadingState {
  fetchingReproductions: boolean;
  fetchingReproduction: boolean;
  creatingReproduction: boolean;
  editingReproduction: boolean;
  deletingReproduction: boolean;
  fetchingSemenDonor: boolean;
  creatingSemenDonor: boolean;
  editingSemenDonor: boolean;
  deletingSemenDonor: boolean;
}

const emptyPagination: Pagination = {} as Pagination;
const emptyReproductionItem: ReproductionItem = {id: 0, type: '', date: ''};
const emptyReproductiveCycleData: ReproductiveCycleData = {} as ReproductiveCycleData;

export const useReproductionStore = defineStore('reproduction', () => {
  // STATE (ref's)
  const reproductions = ref<ReproductionItem[]>([]);
  const reproduction = ref<ReproductionItem | null>(null);
  const donors = ref<SemenDonor[]>([]); // Tipagem mais específica
  const pagination = ref<Pagination>({...emptyPagination});
  const formErrors = ref<Record<string, string[]>>({});
  const reproductionCreateInfo = ref<ReproductiveCycleData>({...emptyReproductiveCycleData});
  const openModalReproductionInfo = ref<boolean>(false);
  const loading = ref<LoadingState>({
    fetchingReproductions: false,
    fetchingReproduction: false,
    creatingReproduction: false,
    editingReproduction: false,
    deletingReproduction: false,
    fetchingSemenDonor: false,
    creatingSemenDonor: false,
    editingSemenDonor: false,
    deletingSemenDonor: false,
  });

  /**
   * Valida o formulário do Doador de Sêmen e retorna os dados validados ou erros.
   * @param data Dados do formulário.
   * @returns Objeto com 'success' e 'data' ou 'errors'.
   */
  function validateSemenDonor(data: SemenDonorForm) {
    try {
      const validatedData = SemenDonorSchema.parse(data);
      formErrors.value = {};
      return {success: true, data: validatedData};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const mappedErrors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!mappedErrors[path]) {
            mappedErrors[path] = [];
          }
          mappedErrors[path].push(err.message);
        });
        formErrors.value = mappedErrors;
        return {success: false, errors: mappedErrors};
      }
      return {success: false, errors: {general: ['Erro de validação desconhecido.']}};
    }
  }

  async function createSemenDonor(form: SemenDonorForm) {
    const uiStore = useUiStore();
    formErrors.value = {};
    const validation = validateSemenDonor(form);

    if (!validation.success) {
      uiStore.setToast({
        type: 'error',
        message: 'Verifique os erros de validação no formulário do doador.',
        title: 'Falha na Validação (Zod).',
        delay: 5000
      });
      return false;
    }

    try {
      loading.value.creatingSemenDonor = true;
      const {$api} = useNuxtApp();

      const response = await $api('/donors/', {
        method: 'POST',
        body: validation.data,
      });

      uiStore.setToast({type: 'success', message: 'Doador criado com sucesso.', title: 'Sucesso.', delay: 5000});
      return response;
    } catch (error) {
      handleApiError(error, uiStore, 'Failed to create semen donor.', 'Erro ao criar doador.');
      return false;
    } finally {
      loading.value.creatingSemenDonor = false;
    }
  }

  async function editSemenDonor(id: number | string, form: SemenDonorForm) {
    const uiStore = useUiStore();
    formErrors.value = {};
    const validation = validateSemenDonor(form);

    if (!validation.success) {
      uiStore.setToast({
        type: 'error',
        message: 'Verifique os erros de validação no formulário do doador.',
        title: 'Falha na Validação (Zod).',
        delay: 5000
      });
      return false;
    }

    try {
      loading.value.editingSemenDonor = true;
      const {$api} = useNuxtApp();

      const response = await $api(`/donors/${id}/`, {
        method: 'PUT',
        body: validation.data,
      });

      uiStore.setToast({type: 'success', message: 'Doador editado com sucesso.', title: 'Sucesso.', delay: 5000});
      return response;
    } catch (error) {
      handleApiError(error, uiStore, 'Failed to edit semen donor.', 'Erro ao editar doador.');
      return false;
    } finally {
      loading.value.editingSemenDonor = false;
    }
  }

  async function deleteSemenDonor(id: number | string) {
    const uiStore = useUiStore();
    try {
      loading.value.deletingSemenDonor = true;
      const {$api} = useNuxtApp();

      await $api(`/donors/${id}/`, {
        method: 'DELETE',
      });

      donors.value = donors.value.filter(donor => donor.id !== id);

      uiStore.setToast({type: 'success', message: 'Doador deletado com sucesso.', title: 'Sucesso.', delay: 5000});
    } catch (error) {
      handleApiError(error, uiStore, 'Failed to delete semen donor.', 'Erro ao deletar doador.');
    } finally {
      loading.value.deletingSemenDonor = false;
    }
  }

  function handleApiError(error: any, uiStore: any, defaultMessage: string, validationTitle: string) {
    console.error('API Error:', error);
    if (error?.response?.status === 400) {
      const errorData = error.response._data || error.data;
      formErrors.value = errorData;
      uiStore.setToast({
        type: 'error',
        message: 'Verifique os erros no formulário.',
        title: validationTitle,
        delay: 5000
      });
    } else {
      uiStore.setToast({
        type: 'error',
        message: defaultMessage,
        title: 'Error.',
        delay: 5000
      });
    }
  }

  async function fetchReproductions(params: Record<string, any> = {}) {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingReproductions = true;
      const {$api} = useNuxtApp();
      const authStore = useAuthStore();
      params.farm = authStore.currentFarm.id;

      const response = await $api('/reproductions/', {
        method: 'GET',
        params: {...params},
      });

      reproductions.value = response.results;
      pagination.value = response.pagination;
    } catch (error: any) {
      uiStore.setToast({
        type: 'error',
        message: 'Failed to fetch reproductions.',
        title: 'Error.',
        delay: 5000
      });
      console.log(error);
    } finally {
      loading.value.fetchingReproductions = false;
    }
  }

  async function fetchSemenDonors() {
    const uiStore = useUiStore();
    try {
      loading.value.fetchingSemenDonor = true;
      const {$api} = useNuxtApp();
      const {results} = await $api(`/donors/`, {
        method: 'GET',
      });
      donors.value = results
    } catch (e) {
      uiStore.setToast({
        type: 'error',
        message: 'Failed to fetch donor list.',
        title: 'Error.',
        delay: 5000
      });
      console.error('Error to fetch donor: ', e)
    } finally {
      loading.value.fetchingSemenDonor = false;
    }
  }

  // (Ação `createReproduction` adaptada, usando o helper `handleApiError` para secar o código)
  async function createReproduction(form: ReproductiveCycleFormInterface) {
    const uiStore = useUiStore();
    formErrors.value = {};
    try {
      loading.value.creatingReproduction = true;
      const {$api} = useNuxtApp();
      const response = await $api('/reproductions/', {
        method: 'POST',
        body: {...form},
      });
      const router = useRouter()
      if (response.status === 'pending') {
        await router.push(`/reproduction/`)
        reproductionCreateInfo.value = {
          id: response.id,
          heat_start_date: response.heat_start_date,
          mating_date: response.mating_date,
          actual_calving_date: response.actual_calving_date,
          predicted_calving_date: response.predicted_calving_date,
          male_animal: response.male_animal,
          female_animal: response.female_animal,
          calf_born: response.calf_born,
          mating_type: response.mating_type,
          status: response.status,
        }
        openModalReproductionInfo.value = true
      }
      if (!openModalReproductionInfo.value) {
        await router.push(`/reproduction/`)
        uiStore.setToast({
          type: 'success',
          message: 'Reproduction created successfully.',
          title: 'Success.',
          delay: 5000
        });
      }
      return response;
    } catch (error) {
      handleApiError(error, uiStore, 'Failed to create reproduction.', 'Falha na Validação.');
      return false;
    } finally {
      loading.value.creatingReproduction = false;
    }
  }

  return {
    reproductions,
    reproduction,
    donors,
    pagination,
    formErrors,
    reproductionCreateInfo,
    openModalReproductionInfo,
    loading,
    createSemenDonor,
    editSemenDonor,
    deleteSemenDonor,
    validateSemenDonor,
    fetchReproductions,
    fetchSemenDonors,
    createReproduction,
  };
});