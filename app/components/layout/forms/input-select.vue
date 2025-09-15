<template>
  <div class="flex items-ce align-items-end gap-2 w-full">
    <div class="form-control w-full">
      <label
          v-if="label"
          class="label"
      >
      <span class="label-text">{{ label }} <span
          v-if="isRequired"
          class="text-error"
      >*</span></span>
      </label>
      <div class="flex">
        <div
            v-if="loading || internalLoading"
            class="input px-0"
        >
          <div class="skeleton h-8 w-full"/>
        </div>
        <select
            v-else
            :class="['select select-bordered w-full', { 'select-error': hasError }]"
            :required="isRequired"
            :value="selectedItemValue"
            @change="handleSelection"
        >
          <option
              v-if="clearable"
              :value="null"
          >
            {{ clearLabel }}
          </option>
          <option
              v-else
              :value="null"
              disabled
          >
            {{ placeholder }}
          </option>

          <option
              v-for="(item, index) in items"
              :key="index"
              :value="getItemValue(item)"
          >
            {{ getItemLabel(item) }}
          </option>
        </select>
      </div>

      <label
          v-if="hasError"
          class="label"
      >
        <span class="label-text-alt text-error">{{ errorMessage }}</span>
      </label>
    </div>
  </div>
</template>

<script
    lang="ts"
    setup
>
import {computed} from 'vue';

const props = defineProps({
  modelValue: {type: [Object, String, Number, null], default: null,},
  items: {type: Array, required: true,},
  optionLabel: {type: String, default: 'label',},
  optionValue: {type: String, default: 'value',},
  isRequired: {type: Boolean, default: false,},
  errorMessage: {type: String, default: '',},
  label: {type: String, default: '',},
  placeholder: {type: String, default: 'Selecione um item',},
  loading: {type: Boolean, default: false,},
  returnObject: {type: Boolean, default: false,},
  clearable: {type: Boolean, default: false},
  clearLabel: {type: String, default: 'Todos'},
});

const emits = defineEmits(['update:modelValue']);

const hasError = computed(() => !!props.errorMessage);
const internalLoading = ref(false)

const getItemValue = (item: any) => {
  return item[props.optionValue];
};

const getItemLabel = (item: any) => {
  return item[props.optionLabel];
};

const selectedItemValue = computed(() => {
  if (props.modelValue === null) {
    return null;
  }
  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    return props.modelValue[props.optionValue];
  }
  return props.modelValue;
});

const handleSelection = (event: Event) => {
  internalLoading.value = true
  const target = event.target as HTMLSelectElement;
  const selectedValue = target.value;

  if (selectedValue === "null" || selectedValue === "") {
    emits('update:modelValue', null);
    return;
  }

  const selectedItem = props.items.find((item: any) => String(item[props.optionValue]) === selectedValue);

  if (props.returnObject) {
    emits('update:modelValue', selectedItem);
  } else {
    emits('update:modelValue', selectedValue);
  }
  internalLoading.value = false
};
</script>

<style scoped>
</style>