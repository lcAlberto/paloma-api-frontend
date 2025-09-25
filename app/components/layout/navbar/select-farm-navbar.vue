<template>
  <div
      ref="dropdownRef"
      :class="{'dropdown-open': isOpen}"
      class="dropdown"
      @click="isOpen = !isOpen"
  >
    <div
        :class="{'btn-active': isOpen}"
        class="btn btn-outline btn-ghost text-xl rounded-field"
        role="button"
        tabindex="0"
    >
      <i class="fa-solid fa-building-wheat"/>
      <span v-if="selected">{{ selected.name }}</span>
      <span v-else>Selecione</span>
      <font-awesome-icon :icon="isOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"/>
    </div>
    <ul
        class="menu dropdown-content bg-base-200 z-1 rounded-none rounded-b-lg w-full p-2 shadow-sm drop-shadow-xl/50 border border-base-100"
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
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, onUnmounted, ref} from "vue";

const store = useAuthStore();
const animalStore = useAnimalStore();
const params = useUrlSearchParams('history');

const farms = computed(() => {
  return store.user?.farms || []
})
const dropdownRef = ref(null);

const isOpen = ref(false)

const selected = ref({})

const selectedFarm = (farm: object) => {
  selected.value = farm
  params.farm = farm.id
  store.currentFarm = farm
  animalStore.fetchAnimals({farm: farm.id})
}

const closeDropdown = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (store.currentFarm)
    selected.value = store.currentFarm
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>


<style scoped>

</style>