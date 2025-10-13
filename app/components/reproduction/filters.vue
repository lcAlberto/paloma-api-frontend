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
      <div class="grid grid-cols-3 content-center gap-3 w-full">
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
        <!--        <input-select-->
        <!--            v-model="queryState.status"-->
        <!--            :items="store.animalStatus"-->
        <!--            :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"-->
        <!--            clearable-->
        <!--            label="Status"-->
        <!--            option-label="name"-->
        <!--            option-value="id"-->
        <!--            return-object-->
        <!--        />-->
        <!--        <div>-->
        <!--          <label class="label">Sexo</label>-->
        <!--          <div class="filter flex w-full">-->
        <!--            <input-->
        <!--                v-model="queryState.sex"-->
        <!--                :value="undefined"-->
        <!--                aria-label="All"-->
        <!--                class="btn filter-reset"-->
        <!--                name="sex"-->
        <!--                type="radio"-->
        <!--            >-->
        <!--            <input-->
        <!--                v-model="queryState.sex"-->
        <!--                aria-label="Macho"-->
        <!--                class="btn"-->
        <!--                name="sex"-->
        <!--                type="radio"-->
        <!--                value="male"-->
        <!--            >-->
        <!--            <input-->
        <!--                v-model="queryState.sex"-->
        <!--                aria-label="Fêmea"-->
        <!--                class="btn"-->
        <!--                name="sex"-->
        <!--                type="radio"-->
        <!--                value="female"-->
        <!--            >-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import InputSelect from "~/components/ui/forms/input-select.vue";

const store = useReproductionStore();
const animalStore = useAnimalStore();
const params = useUrlSearchParams('history');

const queryState = ref({
  farm: params.farm as string || null,
  identifier: params.identifier as string || null,
  maleAnimal: params.male_animal as string || null,
  femaleAnimal: params.female_animal as string || null,
  status: params.status as string || null,
  matingType: params.mating_type as string || null,
  matingDate: params.mating_date as string || null,
  predictedCalvingDate: params.predicted_calving_date as string || null,
  actualCalvingDate: params.actual_calving_date as string || null,
  hasCalf: params.has_calf as string || null,
  // calf: params.calf as string || null,
});

const isOpenFilter = ref(false);
const localLogin = ref(false);

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

// watch(() => store.classifications, (newClassification) => {
//   localLogin.value = true
//   if (queryState.value.classification && newClassification.length > 0) {
//     const foundClassification = newClassification.find(b => b.id.toString() === queryState.value.classification);
//     if (foundClassification) {
//       queryState.value.classification = foundClassification;
//     }
//   }
//   localLogin.value = false
// }, {immediate: true});

// watch(() => store.animalStatus, (newStatus) => {
//   localLogin.value = true
//   if (queryState.value.status && newStatus.length > 0) {
//     const foundClassification = newStatus.find(b => b.id.toString() === queryState.value.status);
//     if (foundClassification) {
//       queryState.value.status = foundClassification;
//     }
//   }
//   localLogin.value = false
// }, {immediate: true});

const debouncedUpdateUrl = useDebounceFn(() => {
  localLogin.value = true
  params.page = '1';

  if (queryState.value.identifier) {
    params.identifier = queryState.value.identifier;
  } else {
    delete params.identifier;
  }

  if (queryState.value.femaleAnimal && queryState.value.femaleAnimal.id) {
    params.female_animal = String(queryState.value.femaleAnimal.id);
  } else {
    delete params.female_animal;
  }
  if (queryState.value.maleAnimal && queryState.value.maleAnimal.id) {
    params.male_animal = String(queryState.value.maleAnimal.id);
  } else {
    delete params.male_animal;
  }
  localLogin.value = false
}, 500);

const clearFilters = () => {
  queryState.value = {
    identifier: null,
    maleAnimal: null,
    femaleAnimal: null,
    status: null,
    matingType: null,
    matingDate: null,
    predictedCalvingDate: null,
    actualCalvingDate: null,
    hasCalf: null,
  };
  params.identifier = ""
  params.male_animal = ""
  params.female_animal = ""
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

watch(params, (value) => {
  store.fetchReproductions(value)
}, {deep: true});

onMounted(() => {
  // store.fetchReproductions();
  animalStore.fetchParents('female');
  animalStore.fetchParents('male');
});
</script>


<style scoped>

</style>