<template>
  <div>
    <div class="grid content-start  md:grid-cols-1 lg:grid-cols-2 gap-5">
      <!--    COL 1-->
      <fieldset class="p-2">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Fêmea
            <sup class="text-error">*</sup>
          </legend>
          <input-select
              v-model="form.female_animal_id"
              :error-message="femaleAnimalIdError"
              :items="animalStore.mothers"
              :loading="animalStore.loading.fetchingAnimalStatus || store.loading.creatingReproduction || localLogin"
              clearable
              option-label="name"
              option-value="id"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Data de Início do Cio
            <sup class="text-error">*</sup>
          </legend>
          <small class="">Data que o comportamento de cio do animal foi detectado</small>
          <input-date
              v-model="form.heat_start_date"
              :error-message="heatStartDateError"
              :loading="localLogin"
              class="!overflow-visible"
              label="Data prevista do parto"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Data da Cobertura
            <sup class="text-error">*</sup>
          </legend>
          <small class="">Data que a cobertura foi concebida, seja com o touro ou via inseminação artificial</small>
          <input-date
              v-model="form.mating_date"
              :error-message="matingDateError"
              :loading="localLogin"
              class="!overflow-visible"
              label="Data da Cobertura"
          />
        </fieldset>
      </fieldset>

      <div class="">
        <fieldset class="p-2">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              Tipo da cobertura
              <sup class="text-error">*</sup>
            </legend>
            <small class="">
              Se a cobertura de seu apartir de um touro da fazenda, você pode já atrelar ele á esse ciclo.
              Mas se foi por inseminação artificial, você pode cadastar o touro doador de sêmen depois.
            </small>
            <div class="filter flex w-full">
              <input
                  v-model="form.mating_type"
                  :value="undefined"
                  aria-label="All"
                  class="btn border-white/10 filter-reset"
                  name="mating_type"
                  type="radio"
              >
              <input
                  v-model="form.mating_type"
                  aria-label="Natural"
                  class="btn border-white/10"
                  name="mating_type"
                  type="radio"
                  value="natural"
              >
              <input
                  v-model="form.mating_type"
                  aria-label="Artificial"
                  class="btn border-white/10"
                  name="mating_type"
                  type="radio"
                  value="artificial"
              >
            </div>
            <span
                v-if="matingTypeError"
                class="label-text-alt text-error"
            >{{ matingTypeError }}</span>
          </fieldset>
          <!--      FATHER -->
          <fieldset
              v-if="form.mating_type === 'natural'"
              class="fieldset"
          >
            <legend class="fieldset-legend">
              Macho
            </legend>
            <span>Selecione o animal se ele for conhecido e já tem cadastro. Ou crie um novo registro</span>
            <div class="flex gap-3">
              <input-select
                  v-model="form.male_animal_id"
                  :error-message="maleAnimalIdError"
                  :items="animalStore.fathers"
                  :loading="animalStore.loading.fetchingAnimalStatus || store.loading.creatingReproduction || localLogin"
                  clearable
                  option-label="name"
                  option-value="id"
              />
              <button class="btn btn-primary">
                <i class="fa fa-plus"/>
              </button>
            </div>
          </fieldset>

          <fieldset
              v-else-if="form.mating_type === 'artificial'"
              class="fieldset"
          >
            <legend class="fieldset-legend">
              Doador
              <sup class="text-error">*</sup>
            </legend>
            <div class="flex gap-3">
              <input-select
                  v-model="form.semen_donor_id"
                  :error-message="maleAnimalIdError"
                  :items="store.donors"
                  :loading="store.loading.fetchingSemenDonor"
                  clearable
                  option-label="name"
                  option-value="id"
              />
              <button class="btn btn-primary">
                <i class="fa fa-plus"/>
              </button>
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Status / {{ form.status }}</legend>
            <input-select
                v-model="form.status"
                :error-message="statusError"
                :items="availableStatuses"
                :loading="store.loading.creatingReproduction || localLogin"
                clearable
                option-label="label"
                option-value="value"
            />
            <p class="label">Optional</p>
          </fieldset>

          <!--      Filho -->
          <fieldset
              v-if="form.status === 'calved'"
              class="fieldset"
          >
            <legend class="fieldset-legend">
              Bezerrro
            </legend>
            <small class="">
              Se este ciclo se já resultou no nascimento do bezerro, você pode selecionar ele aqui. Ou criar um novo
              registro para ele
            </small>
            <div class="flex gap-2">
              <input-select
                  v-model="form.calf_born_id"
                  :error-message="calfBornIdError"
                  :items="animalStore.animals"
                  :loading="animalStore.loading.fetched || store.loading.creatingReproduction || localLogin"
                  clearable
                  option-label="name"
                  option-value="id"
              />
              <animal-register-modal>
                <template #trigger="{toggleModal}">
                  <button
                      class="btn btn-outline btn-sm mt-6"
                      type="button"
                      @click="toggleModal()"
                  >
                    <i class="fa-solid fa-plus mr-2"/>
                    Novo Bezerro
                  </button>
                </template>
              </animal-register-modal>
            </div>
          </fieldset>
        </fieldset>
      </div>

    </div>
    <div class="py-5 w-full">
      <slot
          :fom-data="form"
          name="actions"
      />
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import InputSelect from "~/components/ui/forms/input-select.vue";
import InputDateRange from "~/components/ui/forms/date/input-date-range.vue";
import InputDate from "~/components/ui/forms/date/input-date.vue";
import AnimalRegisterModal from "~/components/animals/animal-register-modal.vue";

const store = useReproductionStore()
const animalStore = useAnimalStore()

const props = defineProps({
  old: {type: Object, required: false, default: null}
})

const form = ref({
  heat_start_date: new Date(),
  mating_date: new Date(),
  mating_type: null,
  // predicted_calving_date: null,
  actual_calving_date: null,
  status: 'pending',
  calf_born_id: null,
  female_animal_id: null,
  male_animal_id: null,
  semen_donor_id: null,
})
const localLogin = ref(false)

const availableStatuses = [
  {value: 'pending', label: 'Pendente'},
  {value: 'active', label: 'Ativo'},
  {value: 'calved', label: 'Bem sucedido'},
  {value: 'failed', label: 'Falhou'},
  {value: 'aborted', label: 'Abortado'},
]

const heatStartDateError = computed(() => {
  return store.formErrors.heat_start_date ? store.formErrors.heat_start_date[0] : '';
});
const matingDateError = computed(() => {
  return store.formErrors.mating_date ? store.formErrors.mating_date[0] : '';
});
const statusError = computed(() => {
  return store.formErrors.status ? store.formErrors.status[0] : '';
});
const calfBornIdError = computed(() => {
  return store.formErrors.calf_born_id ? store.formErrors.calf_born_id[0] : '';
});
const femaleAnimalIdError = computed(() => {
  return store.formErrors.female_animal_id ? store.formErrors.female_animal_id[0] : '';
});
const maleAnimalIdError = computed(() => {
  return store.formErrors.male_animal_id ? store.formErrors.male_animal_id[0] : '';
});
const matingTypeError = computed(() => {
  return store.formErrors.mating_type ? store.formErrors.mating_type[0] : '';
});

onMounted(() => {
  animalStore.fetchParents('male')
  animalStore.fetchParents('female')
  animalStore.fetchAnimals()
  store.fetchSemenDonors()

  if (props.old) {
    form.value = props.old
    if (props.old.male_animal?.id)
      form.value.male_animal_id = props.old.male_animal.id
    if (props.old.female_animal?.id)
      form.value.female_animal_id = props.old.female_animal.id

  }
})
</script>


<style scoped>

</style>