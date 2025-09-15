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
      <div class="flex place-items-stretch gap-3 w-1/2">
        <div class="form-control w-full">
          <label class="label">Identificador</label>
          <input
              v-model="queryState.identifier"
              class="input"
              placeholder="Identificador, brinco"
              type="text"
          >
        </div>
        <input-select
            v-model="queryState.breed"
            :items="store.breeds"
            :loading="store.loading.fetchingBreeds || store.loading.fetched"
            clearable
            label="Raças"
            option-label="name"
            option-value="id"
            return-object
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
      <p>Outros filtros</p>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import InputSelect from "~/components/layout/forms/input-select.vue";

const store = useAnimalStore();
const route = useRoute();
const router = useRouter();

const isOpenFilter = ref(false);

const queryState = ref({
  identifier: route.query.identifier as string || null,
  breed: null,
});

watch(() => store.breeds, (newBreeds) => { // presselect beed
  const breedId = route.query.breed;
  if (breedId && newBreeds.length > 0) {
    const foundBreed = newBreeds.find(b => b.id.toString() === breedId);
    if (foundBreed) {
      queryState.value.breed = foundBreed;
    }
  }
}, {immediate: true});

// pré-select breed
const debouncedUpdateUrl = useDebounceFn(() => {
  const newQuery: Record<string, any> = {...route.query, ...queryState.value};

  if (queryState.value.breed && queryState.value.breed.id) {
    newQuery.breed = queryState.value.breed.id;
  } else {
    delete newQuery.breed;
  }

  Object.keys(newQuery).forEach(key => {
    if (newQuery[key] == null || newQuery[key] === '') {
      delete newQuery[key];
    }
  });


  router.push({query: newQuery});
}, 500);


watch(queryState, () => {
  debouncedUpdateUrl();
}, {deep: true});

onMounted(() => {
  store.fetchBreeds();
});
</script>


<style scoped>

</style>