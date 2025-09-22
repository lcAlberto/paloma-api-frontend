<template>
  <div
      :class="{'dropdown-open': isOpen}"
      class="dropdown"
  >
    <div
        :class="{'btn-active': isOpen}"
        class="btn btn-outline btn-ghost text-xl rounded-field"
        role="button"
        tabindex="0"
        @click="isOpen = !isOpen"
    >
      <span v-if="selected">{{ selected.name }}</span>
      <span v-else>Selecione</span>
    </div>
    <ul
        class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
        tabindex="0"
    >
      <li
          v-for="(item, index) in farms"
          :key="index"
          class="space-y-2"
          @click="selectedFarm(item)"
      >
        <a>{{ item?.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script
    lang="ts"
    setup
>
const store = useAuthStore();
const animalStore = useAnimalStore();
const params = useUrlSearchParams('history');

const farms = computed(() => {
  return store.user?.farms || []
})

const isOpen = ref(false)

const selected = ref({})

const selectedFarm = (farm: object) => {
  selected.value = farm
  params.farm = farm.id
  store.currentFarm = farm
  animalStore.fetchAnimals({farm: farm.id})
}

onMounted(() => {
  if (store.currentFarm)
    selected.value = store.currentFarm
})
</script>


<style scoped>

</style>