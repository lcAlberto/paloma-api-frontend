<template>
  <div>
    <modal
        v-model="isOpen"
        :max-width-class="'max-w-2xl'"
        :width-class="'max-w-xl'"
    >
      <template #header>
        <h3 class="text-lg font-bold">Informações de parto previsto</h3>
      </template>
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto">
          <div class="space-y-4">
            <div>
              <h4 class="font-bold">Data prevista de parto:</h4>
              <p>{{ predictedCalvingDate }}</p>
            </div>
            <div>
              <h4 class="font-bold">Dias restantes para o parto:</h4>
              <p>{{ daysUntilCalving }}</p>
            </div>
            <div>
              <h4 class="font-bold">Instruções especiais:</h4>
              <p>{{ specialInstructions }}</p>
            </div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>
<script
    lang="ts"
    setup
>
import Modal from "~/components/ui/dialogs/modal.vue";

const props = defineProps({
  modelValue: {type: Boolean, default: false}
});

const emits = defineEmits(['update:modelValue']);

const reproductionStore = useReproductionStore();

const isOpen = ref(false);

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
  if (!newVal) {
    emits('update:modelValue', false);
  }
});
</script>


<style scoped>

</style>