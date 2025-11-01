<template>
  <div>
    <br>
    <p>openModalReproductionInfo? {{ openModalReproductionInfo }}</p>
    <modal
        v-model="openModalReproductionInfo"
        :max-width-class="'max-w-full'"
        @close="reproductionStore.openModalReproductionInfo = false"
    >
      <template #header>
        <h3 class="text-lg font-bold">Informações de parto previsto</h3>
      </template>
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto">
          <div class="space-y-4">
            <div>
              <h4 class="font-bold">Data prevista de parto:</h4>
              <p>{{ reproductionInfo.predicted_calving_date }}</p>
            </div>
            <div>
              <h4 class="font-bold">Dias restantes para o parto:</h4>
              <p>{{ reproductionInfo.female_animal }}</p>
            </div>
            <div>
              <h4 class="font-bold">Instruções especiais:</h4>
              <p>fkjrlketjlk</p>
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

const reproductionStore = useReproductionStore();
const {openModalReproductionInfo} = storeToRefs(reproductionStore)
const reproductionInfo = reproductionStore.reproductionCreateInfo

</script>


<style scoped>

</style>