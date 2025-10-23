<template>
  <div class="collapse p-4 bg-base-200 rounded-b-none rounded-t-xl items-center gap-2 overflow-visible">
    <input
        v-model="isOpenFilter"
        class="peer hidden"
        type="checkbox"
    >
    <div class="collapse-title p-0 bg-primary-100 rounded-t-xl font-medium flex items-center justify-between gap-2">
      <div
          class="flex place-items-center gap-3 xl:w-1/2"
      >
        <div class="min-w-fit flex flex-col items-ce align-items-end w-full">
          <input-date-range
              v-model="queryState.predictedCalvingDate"
              :loading="localLogin"
              class="!overflow-visible"
              label="Parto Previsto"
          />
        </div>
        <div class="min-w-fit flex flex-col items-ce align-items-end w-full">
          <input-date-range
              v-model="queryState.actualCalvingDate"
              :loading="localLogin"
              class="!overflow-visible"
              label="Cobertura"
          />
        </div>
        <input-select
            v-model="queryState.femaleAnimal"
            :items="animalStore.mothers"
            :loading="animalStore.loading.fetchingParents || localLogin"
            clearable
            label="Fêmea"
            option-label="name"
            option-value="id"
            return-object
        />
        <button
            class="btn mt-5"
            @click="clearFilters"
        >
          Limpar
          <i class="fa fa-delete-left"/>
        </button>
      </div>
      <button>
        <UButton
            :trailing-icon="isOpenFilter ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
            color="neutral"
            size="md"
            variant="ghost"
            @click="isOpenFilter = !isOpenFilter"
        >Mais filtros
        </UButton>
      </button>
    </div>
    <div
        :class="{ 'hidden': !isOpenFilter }"
        class="collapse-content flex py-4 px-0 bg-base-200 rounded-t-xl items-center gap-2"
    >
      <div class="grid md:grid-cols-5 content-center gap-3 w-full">
        <div class="min-w-fit flex flex-col items-ce align-items-end w-full">
          <input-date-range
              v-model="queryState.matingDate"
              :loading="localLogin"
              class="!overflow-visible"
              label="Data do parto"
          />
        </div>
        <input-select
            v-model="queryState.maleAnimal"
            :items="animalStore.fathers"
            :loading="animalStore.loading.fetchingParents || localLogin"
            clearable
            label="Macho"
            option-label="name"
            option-value="id"
            return-object
        />
        <input-select
            v-model="queryState.calf"
            :items="animalStore.animals"
            :loading="animalStore.loading.fetched || localLogin"
            clearable
            label="Bezerro"
            option-label="name"
            option-value="id"
            return-object
        />
        <input-select
            v-model="queryState.status"
            :items="availableStatus"
            :loading="localLogin"
            clearable
            label="Status"
            option-label="name"
            option-value="value"
            return-object
        />
        <div>
          <label class="label">Tipo</label>
          <div class="filter flex w-full">
            <input
                v-model="queryState.matingType"
                :value="undefined"
                aria-label="All"
                class="btn filter-reset"
                name="sex"
                type="radio"
            >
            <input
                v-model="queryState.matingType"
                aria-label="Natural"
                class="btn"
                name="sex"
                type="radio"
                value="natural"
            >
            <input
                v-model="queryState.matingType"
                aria-label="Inseminação Artificial"
                class="btn"
                name="sex"
                type="radio"
                value="artificial"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import InputSelect from "~/components/ui/forms/input-select.vue";
import InputDateRange from "~/components/ui/forms/date/input-date-range.vue";

const store = useReproductionStore();
const animalStore = useAnimalStore();
const params = useUrlSearchParams('history');

const parseDateRange = (dateString: string | string[] | null) => {
  const str = Array.isArray(dateString) ? dateString[0] : dateString;
  if (str && str.includes(',')) {
    const [startDate, endDate] = str.split(',');
    return {startDate, endDate};
  }
  return {startDate: null, endDate: null};
};
const queryState = ref({
  farm: params.farm as string || null,
  // identifier: params.identifier as string || null,
  maleAnimal: params.male_animal as string || null,
  femaleAnimal: params.female_animal as string || null,
  calf: params.calf as string || null,
  status: params.status as string || null,
  matingType: params.mating_type as string || null,
  matingDate: parseDateRange(params.mating_date || null),
  predictedCalvingDate: parseDateRange(params.predicted_calving_date || null),
  actualCalvingDate: parseDateRange(params.actual_calving_date || null),
  // hasCalf não está no template, mas mantive a lógica
  hasCalf: params.has_calf as string || null,
});

const isOpenFilter = ref(false);
const localLogin = ref(false);
const availableStatus = [
  {value: 'active', name: 'Active'},
  {value: 'calved', name: 'Calved'},
  {value: 'failed', name: 'Failed'},
  {value: 'aborted', name: 'Aborted'},
  {value: 'pending', name: 'Pending Confirmation'},
]

watch(() => animalStore.mothers, (newMothers) => {
  localLogin.value = true
  if (queryState.value.femaleAnimal && newMothers.length > 0) {
    const foundMother = newMothers.find(mother => mother.id.toString() === queryState.value.femaleAnimal);
    if (foundMother) {
      queryState.value.femaleAnimal = foundMother;
    }
  }
  localLogin.value = false
}, {immediate: true});

watch(() => animalStore.fathers, (newFathers) => {
  localLogin.value = true
  if (queryState.value.maleAnimal && newFathers.length > 0) {
    const foundFather = newFathers.find(mother => mother.id.toString() === queryState.value.maleAnimal);
    if (foundFather) {
      queryState.value.maleAnimal = foundFather;
    }
  }
  localLogin.value = false
}, {immediate: true});

watch(() => animalStore.animals, (newAnimals) => {
  localLogin.value = true
  if (queryState.value.calf && newAnimals.length > 0) {
    const foundCalf = newAnimals.find(animal => animal.id.toString() === queryState.value.calf);
    if (foundCalf) {
      queryState.value.calf = foundCalf;
    }
  }
  localLogin.value = false
}, {immediate: true});

watch(() => availableStatus, (newStatusList) => {
  localLogin.value = true
  if (queryState.value.status && newStatusList.length > 0) {
    const foundStatus = newStatusList.find(s => s.value === queryState.value.status);
    if (foundStatus) {
      queryState.value.status = foundStatus;
    }
  }
  localLogin.value = false
}, {immediate: true});

const debouncedUpdateUrl = useDebounceFn(() => {
  localLogin.value = true
  params.page = '1';

  const setDateRangeParam = (key: string, dateRange: any) => {
    if (dateRange.startDate && dateRange.endDate) {
      params[key] = `${dateRange.startDate},${dateRange.endDate}`;
    } else {
      delete params[key];
    }
  };

  const setSelectObjectParam = (key: string, value: any, prop: string = 'id') => {
    if (value && value[prop]) {
      params[key] = String(value[prop]);
    } else {
      delete params[key];
    }
  };

  // if (queryState.value.identifier) {
  //   params.identifier = queryState.value.identifier;
  // } else {
  //   delete params.identifier;
  // }

  setSelectObjectParam('female_animal', queryState.value.femaleAnimal);
  setSelectObjectParam('male_animal', queryState.value.maleAnimal);
  setSelectObjectParam('calf', queryState.value.calf);
  setSelectObjectParam('status', queryState.value.status, 'value');
  if (queryState.value.matingType) {
    params.mating_type = queryState.value.matingType;
  } else {
    delete params.mating_type;
  }

  setDateRangeParam('predicted_calving_date', queryState.value.predictedCalvingDate);
  setDateRangeParam('actual_calving_date', queryState.value.actualCalvingDate);
  setDateRangeParam('mating_date', queryState.value.matingDate);
  if (queryState.value.hasCalf) {
    params.has_calf = queryState.value.hasCalf;
  } else {
    delete params.has_calf;
  }

  localLogin.value = false
}, 500);

const clearFilters = () => {
  queryState.value = {
    farm: queryState.value.farm || null,
    identifier: null,
    maleAnimal: null,
    femaleAnimal: null,
    calf: null, // NOVO
    status: null,
    matingType: null,
    matingDate: {startDate: null, endDate: null},
    predictedCalvingDate: {startDate: null, endDate: null},
    actualCalvingDate: {startDate: null, endDate: null},
    hasCalf: null,
  };
  params.identifier = ""
  params.male_animal = ""
  params.female_animal = ""
  params.calf = "" // NOVO
  params.status = ""
  params.mating_type = ""
  params.mating_date = ""
  params.predicted_calving_date = ""
  params.actual_calving_date = ""
  params.has_calf = ""
}

watch(queryState, () => {
  debouncedUpdateUrl();
}, {deep: true});

watch(() => queryState.value.predictedCalvingDate, debouncedUpdateUrl, {deep: true});
watch(() => queryState.value.actualCalvingDate, debouncedUpdateUrl, {deep: true});
watch(() => queryState.value.matingDate, debouncedUpdateUrl, {deep: true});

watch(params, (value) => {
  store.fetchReproductions(value)
}, {deep: true});

onMounted(() => {
  // store.fetchReproductions();
  animalStore.fetchParents('female');
  animalStore.fetchParents('male');
  animalStore.fetchAnimals();
});
</script>


<style scoped>

</style>