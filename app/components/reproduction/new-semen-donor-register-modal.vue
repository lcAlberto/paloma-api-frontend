<template>
  <div>
    <modal
        v-model="isOpen"
        width-class="w-7xl"
        @close=""
    >
      <template #header>
        <div>
          <div class="flex flex-col w-full gap-3">
            <div class="bg-secondary-content text-secondary w-min py-2 px-2 rounded-xl">
              <i class="fa-solid fa-calendar-alt fa-3x"/>
            </div>
            <div class="flex flex-col w-full">
              <h3 class="text-2xl font-bold">Cadastrar novo touro doador</h3>

            </div>
          </div>
        </div>
      </template>
      <template #body>
        <div>
          <p>Registre os dados do touro que irá doar o sêmen pra ser fertilizado.
            Você pode encontrar esses dados na paleta de inseminação</p>
          //
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
})

const isOpen = ref(false)

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

</script>


<style scoped>

</style>