<template>
  <div
      ref="dropdownRef"
      :class="{'dropdown-open': isOpen, [position]: true}"
      class="dropdown"
      @click="isOpen = !isOpen"
  >
    <div
        :class="buttonClass"
        role="button"
        tabindex="0"
    >
      <slot
          :item="selectedItem"
          name="activator"
      >
        <span v-if="placeholder">
          {{ selectedItem ? getItemLabel(selectedItem) : placeholder }}
        </span>
        <font-awesome-icon
            v-if="icon"
            :icon="icon"
        />
      </slot>
    </div>

    <ul
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm drop-shadow-xl/50"
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
        <a
            :class="{'flex-row-reverse': position.includes('left'),}"
            class="flex"
            @click="handleSelection(item)"
        >
          <FontAwesomeIcon
              v-if="item.icon"
              :icon="['fas', item.icon]"
          />
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
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  modelValue: {type: [Object, String, Number, null], default: null},
  options: {type: Array, required: true},
  optionLabel: {type: String, default: 'label'},
  optionValue: {type: String, default: 'value'},
  position: {type: String, default: 'dropdown-left'},
  icon: {type: Array, required: false},
  buttonClass: {type: String, default: 'btn m-1'},
  placeholder: {type: String, required: false},
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

const getPosition = () => {
  return props.position.replace('dropdow-', '')
}

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
