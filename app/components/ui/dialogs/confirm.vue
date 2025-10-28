<template>
  <dialog
      id="default_confirm_modal"
      ref="default_confirm_modal"
      class="modal flex items-center justify-center"
      @close="close()"
  >
    >
    <div
        :class="[colorClasses, props.soft ? 'bg-opacity-10' : '']"
        class="modal-box"
    >
      <form
          v-if="closable"
          method="dialog"
      >
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3
          :class="`text-${type}`"
          class="text-lg font-bold"
      >
        <i
            v-if="icon"
            :class="[icon, `text-${type}`, 'mr-2 text-2xl']"
            class="animate-bounce"
        />
        {{ title }}
      </h3>
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <button
            class="btn"
            @click="close()"
        >
          <i
              v-if="cancelButtonIcon"
              :class="cancelButtonIcon"
          />
          {{ cancelButtonLabel }}
        </button>
        <button
            :class="`btn-${type} ${outline ? 'btn-outline' : ''}`"
            class="btn"
            @click="confirm()"
        >
          <i
              v-if="confirmButtonIcon"
              :class="confirmButtonIcon"
          />
          {{ confirmButtonLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>
<script
    lang="ts"
    setup
>
const props = defineProps({
  modelValue: {type: Boolean, default: false},
  type: {
    type: String,
    default: 'neutral',
    validator: (value: string) => ['success', 'error', 'warning', 'info', 'neutral'].includes(value),
  },
  message: {type: String, default: 'Olá!'},
  icon: {type: String, default: 'fa fa-info'},
  title: {type: String, default: ''},
  cancelButtonLabel: {type: String, default: 'Cancelar'},
  confirmButtonLabel: {type: String, default: 'OK'},
  cancelButtonIcon: {type: String, default: '', required: false},
  confirmButtonIcon: {type: String, default: '', required: false},
  timeout: {type: Number, default: 5},
  delay: {type: Number, default: 5000},
  soft: {type: Boolean, default: false},
  outline: {type: Boolean, default: false},
  closable: {type: Boolean, default: false},
  required: {type: Boolean, default: false},
});

const emits = defineEmits(['close', 'accept', 'confirm', 'update:modelValue']);

const default_confirm_modal = ref<HTMLDialogElement | null>(null);

const colorClasses = computed(() => {
  return {
    'alert-primary': props.type === 'primary',
    'alert-success': props.type === 'success',
    'alert-error': props.type === 'error',
    'alert-warning': props.type === 'warning',
    'alert-info': props.type === 'info',
    'alert-neutral': props.type === 'neutral',
  };
});

const close = () => {
  emits('close');
  emits('update:modelValue', false);
}

const confirm = () => {
  emits('confirm');
  emits('update:modelValue', false);
}

watch(() => props.modelValue, (newVal) => {
  if (default_confirm_modal.value) {
    if (newVal) {
      default_confirm_modal.value.showModal();
    } else {
      default_confirm_modal.value.close();
    }
  }
});

onMounted(() => {
});

onBeforeUnmount(() => {
});
</script>


<style scoped>
</style>