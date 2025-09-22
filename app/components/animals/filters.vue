<template>
  <div
      class="collapse p-4 bg-base-200 rounded-b-none rounded-t-xl items-center gap-2"
  >
    <input
        v-model="isOpenFilter"
        class="peer hidden"
        type="checkbox"
    >
    <div class="collapse-title p-0 bg-primary-100 rounded-t-xl font-medium flex items-center justify-between gap-2">
      <div class="flex place-items-center gap-3 w-1/2">
        <div class="flex flex-col items-ce align-items-end w-full">
          <label class="label">Identificador</label>
          <input
              v-model="queryState.identifier"
              class="input w-full"
              placeholder="Identificador, brinco"
              type="text"
          >
        </div>
        <input-select
            v-model="queryState.breed"
            :items="store.breeds"
            :loading="store.loading.fetchingBreeds || store.loading.fetched || localLogin"
            clearable
            label="Raças"
            option-label="name"
            option-value="id"
            return-object
        />
        <UButton
            :trailing-icon="'i-heroicons-chevron-up-20-solid'"
            color="neutral"
            label="Clear"
            size="md"
            variant="ghost"
            @click="clearFilters"
        />
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
      <div class="grid grid-cols-3 content-center gap-3 w-full">
        <input-select
            v-model="queryState.classification"
            :items="store.classifications"
            :loading="store.loading.fetchingClassifications || store.loading.fetched || localLogin"
            clearable
            label="Classificações"
            option-label="name"
            option-value="id"
            return-object
        />
        <input-select
            v-model="queryState.status"
            :items="store.animalStatus"
            :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
            clearable
            label="Status"
            option-label="name"
            option-value="id"
            return-object
        />
        <div>
          <label class="label">Sexo</label>
          <div class="filter flex w-full">
            <input
                v-model="queryState.sex"
                :value="undefined"
                aria-label="All"
                class="btn filter-reset"
                name="sex"
                type="radio"
            >
            <input
                v-model="queryState.sex"
                aria-label="Macho"
                class="btn"
                name="sex"
                type="radio"
                value="male"
            >
            <input
                v-model="queryState.sex"
                aria-label="Fêmea"
                class="btn"
                name="sex"
                type="radio"
                value="female"
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
import InputSelect from "~/components/layout/forms/input-select.vue";

const store = useAnimalStore();
const params = useUrlSearchParams('history');

const queryState = ref({
  farm: params.farm as string || null,
  identifier: params.identifier as string || null,
  breed: params.breed as string || null,
  classification: params.classification as string || null,
  status: params.status as string || null,
  sex: params.sex as string || null,
});

const isOpenFilter = ref(false);
const localLogin = ref(false);

watch(() => store.breeds, (newBreeds) => {
  localLogin.value = true
  if (queryState.value.breed && newBreeds.length > 0) {
    const foundBreed = newBreeds.find(b => b.id.toString() === queryState.value.breed);
    if (foundBreed) {
      queryState.value.breed = foundBreed;
    }
  }
  localLogin.value = false
}, {immediate: true});

watch(() => store.classifications, (newClassification) => {
  localLogin.value = true
  if (queryState.value.classification && newClassification.length > 0) {
    const foundClassification = newClassification.find(b => b.id.toString() === queryState.value.classification);
    if (foundClassification) {
      queryState.value.classification = foundClassification;
    }
  }
  localLogin.value = false
}, {immediate: true});

watch(() => store.animalStatus, (newStatus) => {
  localLogin.value = true
  if (queryState.value.status && newStatus.length > 0) {
    const foundClassification = newStatus.find(b => b.id.toString() === queryState.value.status);
    if (foundClassification) {
      queryState.value.status = foundClassification;
    }
  }
  localLogin.value = false
}, {immediate: true});

const debouncedUpdateUrl = useDebounceFn(() => {
  localLogin.value = true
  params.page = '1';

  if (queryState.value.identifier) {
    params.identifier = queryState.value.identifier;
  } else {
    delete params.identifier;
  }

  if (queryState.value.sex) {
    params.sex = queryState.value.sex;
  } else {
    delete params.sex;
  }

  if (queryState.value.breed && queryState.value.breed.id) {
    params.breed = String(queryState.value.breed.id);
  } else {
    delete params.breed;
  }
  if (queryState.value.classification && queryState.value.classification.id) {
    params.classification = String(queryState.value.classification.id);
  } else {
    delete params.classification;
  }
  if (queryState.value.status && queryState.value.status.id) {
    params.status = String(queryState.value.status.id);
  } else {
    delete params.status;
  }
  localLogin.value = false
}, 500);

const clearFilters = () => {
  queryState.value = {
    identifier: null,
    breed: null,
    classification: null,
    status: null,
    sex: null,
    farm: null
  };
  params.identifier = ""
  params.breed = ""
  params.classification = ""
  params.status = ""
}

watch(queryState, () => {
  debouncedUpdateUrl();
}, {deep: true});

watch(params, (value) => {
  store.fetchAnimals(value)
}, {deep: true});

onMounted(() => {
  store.fetchBreeds();
  store.fetchAnimalStatus();
  store.fetchClassifications();
});
</script>


<style scoped>

</style>