<template>
  <dialog
      id="default_modal"
      ref="default_modal"
      class="modal flex items-center justify-center"
      @close="close()"
  >
    <div
        :class="[props.widthClass, props.maxWidthClass]"
        class="modal-box"
    >
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <slot name="header">
        <h3 class="text-lg font-bold">Hello!</h3>
      </slot>
      <slot
          class="py-4"
          name="body"
      >
        <p class="py-4">Welcome to our modal component.</p>
      </slot>
      <!--      <slot name="footer">-->
      <!--        <div-->
      <!--            class="modal-action"-->
      <!--        >-->
      <!--          <button-->
      <!--              class="btn btn-primary"-->
      <!--              @click="close()"-->
      <!--          >-->
      <!--            Fechar-->
      <!--          </button>-->
      <!--        </div>-->
      <!--      </slot>-->
    </div>
  </dialog>
</template>
<script
    lang="ts"
    setup
>
const props = defineProps({
  modelValue: {type: Boolean, default: false},
  widthClass: {type: String, default: 'max-w-lg'},
  maxWidthClass: {type: String, default: 'max-w-3xl'},
});
const emits = defineEmits(['close', 'update:modelValue']);

const default_modal = ref<HTMLDialogElement | null>(null);

watch(() => props.modelValue, (newVal) => {
  if (default_modal.value) {
    if (newVal) {
      default_modal.value.showModal();
    } else {
      default_modal.value.close();
    }
  }
});

const close = () => {
  emits('close');
  emits('update:modelValue', false);
}
</script>


<style scoped>

</style>