<template>
  <div>
    <slot
        :is-open="isOpen"
        :toggle-modal="toggleModal"
        name="trigger"
    />
    <modal
        v-model="isOpen"
        :max-width-class="'max-w-4xl'"
        :width-class="'max-w-3xl'"
    >
      <template #header>
        <h3 class="text-lg font-bold">Registrar novo animal</h3>
      </template>
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto">
          <animals-animal-form>
            <template #actions="{fomData}">
              <div
                  class="flex flex-col md:flex-row justify-end gap-5"
              >
                <button
                    class="btn"
                    @click="toggleModal()"
                >
                  Fechar
                </button>
                <button
                    class="btn btn-primary"
                    @click="create(fomData)"
                >
                  <FontAwesomeIcon :icon="['fas', 'check']"/>
                  Salvar
                </button>
              </div>
            </template>
          </animals-animal-form>
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
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

const store = useAnimalStore()
const uiStore = useUiStore();

const isOpen = ref(false);

const toggleModal = () => {
  isOpen.value = !isOpen.value;
}

const create = async (formData: AnimalFormInterface) => {
  console.log('formData', formData);
  const response = await store.createAnimal(formData)
  if (response) {
    uiStore.setToast({type: 'success', message: 'Animal created successfully.', title: 'Success.', delay: 5000});
    isOpen.value = false;
  }
}
</script>


<style scoped>

</style>