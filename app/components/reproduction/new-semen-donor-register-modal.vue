<template>
  <div>
    <modal
        v-model="isOpen"
        width-class="w-7xl"
        @close="emits('update:modelValue', false)"
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
          <div class="grid grid-cols-2 gap-3 content-start items-start">

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Nome
                <sup class="text-error">*</sup>
              </legend>
              <small class="">Nome ou apelido do touro</small>
              <input
                  v-model="form.name"
                  :class="{'input-error': nameError}"
                  class="input w-full"
                  type="text"
              >
              <p
                  v-if="nameError"
                  class="label text-error"
              >{{ nameError }}</p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">Raça</legend>
              <small class="">Necessário pra rastreabilidade genética</small>
              <input-select
                  v-model="form.breed_id"
                  :class="{'input-error': breedError}"
                  :items="breeds"
                  :loading="false"
                  clearable
                  option-label="name"
                  option-value="id"
              />
              <p
                  v-if="breedError"
                  class="label text-error"
              >{{ breedError }}</p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Número de registro
                <sup class="text-error">*</sup>
              </legend>
              <small class="">Número de registro ou número da pipeta da amostra semen</small>
              <input
                  v-model="form.registration_number"
                  :class="{'input-error': registrationNumberError}"
                  class="input w-full"
                  type="text"
              >
              <p
                  v-if="registrationNumberError"
                  class="label text-error"
              >{{ registrationNumberError }}</p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Data de nascimento
              </legend>
              <small class="">Se exisit essa informação, adicione aqui</small>
              <input-date
                  v-model="form.born_date"
                  :error-message="bornDateError"
                  :loading="false"
                  class="!overflow-visible"
              />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Fazenda de origem
                <sup class="text-error">*</sup>
              </legend>
              <small class="">Fazenda de origem da amostra</small>
              <input
                  v-model="form.origin_farm_name"
                  :class="{'input-error': originFarmNameError}"
                  class="input w-full"
                  type="text"
              >
              <p
                  v-if="originFarmNameError"
                  class="label text-error"
              >{{ originFarmNameError }}</p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Data da coleta
                <sup class="text-error">*</sup>
              </legend>
              <small class="">Data em que o sêmen foi coletado</small>
              <input-date
                  v-model="form.collection_date"
                  :error-message="collectionDateError"
                  :loading="false"
                  class="!overflow-visible"
              />
            </fieldset>
          </div>
        </div>

        <div class="">
          <div
              class="flex flex-col md:flex-row justify-end gap-5"
          >
            <button
                class="btn"
                @click="emits('update:modelValue')"
            >
              Fechar
            </button>
            <button
                class="btn btn-primary"
                @click="create()"
            >
              <FontAwesomeIcon :icon="['fas', 'check']"/>
              Salvar
            </button>
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
import InputDate from "~/components/ui/forms/date/input-date.vue";
import {storeToRefs} from "pinia";
import InputSelect from "~/components/ui/forms/input-select.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {SemenDonorForm} from "~/schemas/semenDonorSchema";

const props = defineProps({
  modelValue: {type: Boolean, default: false}
})
const emits = defineEmits(['update:modelValue'])

const reproductionStore = useReproductionStore()
const animalStore = useAnimalStore()


const {breeds} = storeToRefs(animalStore)
const {formErrors} = storeToRefs(reproductionStore)

const isOpen = ref(false)


const form = ref<SemenDonorForm>({
  name: '',
  registration_number: null,
  breed_id: null,
  born_date: null,
  origin_farm_name: '',
  collection_date: null,
})

const create = () => {
  reproductionStore.createSemenDonor(form.value).then((response) => {
    if (response && response.id) {
      emits('update:modelValue', false)
      isOpen.value = false
    }
  })
}
const getFieldError = (fieldName: keyof SemenDonorForm) => {
  const errors = formErrors.value[fieldName];
  return errors && errors.length > 0 ? errors[0] : null;
};

const nameError = computed(() => getFieldError('name'));
const registrationNumberError = computed(() => getFieldError('registration_number'));
const breedError = computed(() => getFieldError('breed_id'));
const originFarmNameError = computed(() => getFieldError('origin_farm_name'));
const bornDateError = computed(() => getFieldError('born_date'));
const collectionDateError = computed(() => getFieldError('collection_date'));


watch(() => props.modelValue, (val) => {
  isOpen.value = val
  if (val)
    animalStore.fetchBreeds()
})

onUnmounted(() => {
  isOpen.value = false
  emits('update:modelValue', false)
})

</script>

<style scoped>

</style>