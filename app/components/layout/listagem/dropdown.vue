<template>
  <div
      ref="dropdownRef"
      :class="{'dropdown-open': isOpen, [position]: true}"
      class="dropdown"
  >
    <div
        class="btn m-1"
        role="button"
        tabindex="0"
        @click="isOpen = !isOpen"
    >
      <slot
          :item="selectedItem"
          name="button-content"
      >
        {{ selectedItem ? getItemLabel(selectedItem) : placeholder }}
      </slot>
    </div>

    <ul
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm drop-shadow-xl"
        tabindex="0"
    >
      <li v-if="clearable">
        <a @click="handleSelection(null)">
          {{ clearLabel }}
        </a>
      </li>

      <li
          v-for="(item, index) in options"
          :key="index"
      >
        <a @click="handleSelection(item)">
          {{ getItemLabel(item) }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script
    lang="ts"
    setup
>
import {ref, computed, onMounted, onUnmounted} from 'vue';

const props = defineProps({
  modelValue: {type: [Object, String, Number, null], default: null},
  options: {type: Array, required: true},
  optionLabel: {type: String, default: 'label'},
  optionValue: {type: String, default: 'value'},
  position: {type: String, default: 'dropdown-left'},
  placeholder: {type: String, default: 'Selecione um item'},
  returnObject: {type: Boolean, default: false},
  clearable: {type: Boolean, default: false},
  clearLabel: {type: String, default: 'Todos'},
});

const emits = defineEmits(['update:modelValue', 'selected']);

const isOpen = ref(false);
const dropdownRef = ref(null);

const getItemLabel = (item: any) => {
  return item[props.optionLabel];
};

const getItemValue = (item: any) => {
  return item[props.optionValue];
};

const selectedItem = computed(() => {
  if (props.modelValue === null) {
    return null;
  }
  if (props.returnObject) {
    return props.modelValue;
  }
  return props.options.find(item => getItemValue(item) === props.modelValue);
});

const handleSelection = (item: any | null) => {
  if (item === null) {
    emits('update:modelValue', null);
    emits('selected', null);
  } else {
    if (props.returnObject) {
      emits('update:modelValue', item);
      emits('selected', item);
    } else {
      emits('update:modelValue', getItemValue(item));
      emits('selected', getItemValue(item));
    }
  }
  isOpen.value = false;
};

const closeDropdown = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
</style>
