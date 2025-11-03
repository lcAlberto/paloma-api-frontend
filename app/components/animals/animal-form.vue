<template>
  <div>
    <div class="grid content-start md:grid-cols-1 md:grid-cols-3 gap-5">
      <!--    COL 1-->
      <div class="">
        <div class="card bg-base-100 shadow-sm group cursor-pointer">
          <figure class="relative">
            <img
                class="mask-b-from-0% mask-b-to-100% invert-20 group-hover:invert-0"
                src="https://images.pexels.com/photos/2496506/pexels-photo-2496506.jpeg"
            >
          </figure>
          <div class="card-body flex items-centers justify-end w-full h-full absolute">
            <div class="h-min flex justify-between">
              <div>
                <h2 class="card-title">Imagem do animal</h2>
                <p>Carregue uma imagem para facilitar a identificação do animal</p>
                <small>image.jpg</small>
              </div>
              <div class="card-actions">
                <button class="btn btn-circle">//</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--    COL2-->
      <div class="">
        <fieldset class="p-2">
          <legend class="fieldset-legend uppercase">Identificação do animal</legend>
          <!--      IDENTIFIER-->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Código</legend>
            <!--          <small class="">Número do brinco, colar ou identificador, como se fosse o RG do animal</small>-->
            <input
                v-model="form.identifier"
                class="input w-full"
                type="text"
            >
            <span
                v-if="identifierError"
                class="label-text-alt text-error font-bold"
            >
              {{ identifierError }}
            </span>
          </fieldset>

          <!--      NAME-->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Nome</legend>
            <input
                v-model="form.name"
                class="input w-full"
                type="text"
            >
            <span
                v-if="nameError"
                class="label-text-alt text-error font-bold"
            >
              {{ name }}
            </span>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Nascimento</legend>
            <input
                v-model="form.born_date"
                class="input w-full"
                type="date"
            >
            <span
                v-if="bornDateError"
                class="label-text-alt text-error font-bold"
            >
              {{ bornDateError }}
            </span>
          </fieldset>

          <!--      SEX-->
          <div>
            <label class="label">Sexo</label>
            <div class="filter flex w-full">
              <input
                  v-model="form.sex"
                  :value="undefined"
                  aria-label="All"
                  class="btn btn-ghost border-white/10 filter-reset"
                  name="sex"
                  type="radio"
              >
              <input
                  v-model="form.sex"
                  aria-label="Macho"
                  class="btn btn-ghost border-white/10"
                  name="sex btn-outline"
                  type="radio"
                  value="male"
              >
              <input
                  v-model="form.sex"
                  aria-label="Fêmea"
                  class="btn btn-ghost border-white/10"
                  name="sex"
                  type="radio"
                  value="female"
              >
              <span
                  v-if="sexError"
                  class="label-text-alt text-error font-bold"
              >
              {{ sexError }}
            </span>
            </div>
          </div>
          <p class="label">Optional</p>
        </fieldset>
        <!--      MOTHER-->
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Raça</legend>
          <input-select
              v-model="form.breed_id"
              :error-message="breedIdError"
              :items="store.breeds"
              :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
              clearable
              option-label="name"
              option-value="id"
          />
          <p class="label">Optional</p>
        </fieldset>
      </div>

      <!--    COL3-->
      <div class="">
        <fieldset class="p-2">
          <legend class="fieldset-legend uppercase">Filiação</legend>
          <!--      MOTHER-->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Mãe</legend>
            <input-select
                v-model="form.mother_id"
                :error-message="motherIdError"
                :items="store.mothers"
                :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
                clearable
                option-label="name"
                option-value="id"
            />
            <p class="label">Optional</p>
          </fieldset>
          <!--      FATHER -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Pai</legend>
            <input-select
                v-model="form.father_id"
                :error-message="fatherIdError"
                :items="store.fathers"
                :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
                clearable
                option-label="name"
                option-value="id"
            />
            <p class="label">Optional</p>
          </fieldset>
        </fieldset>
        <!--      ----------- -->
        <fieldset class="p-2 space-y-2">
          <legend class="fieldset-legend uppercase">Produção</legend>
          <!--           CLASSIFICATION-->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Classificação</legend>
            <input-select
                v-model="form.classification_id"
                :error-message="classificationIdError"
                :items="store.classifications"
                :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
                clearable
                option-label="name"
                option-value="id"
            />
            <p class="label">Optional</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Status atual</legend>
            <input-select
                v-model="form.status_id"
                :error-message="statusIdError"
                :items="store.animalStatus"
                :loading="store.loading.fetchingAnimalStatus || store.loading.fetched || localLogin"
                clearable
                option-label="name"
                option-value="id"
            />
            <p class="label">Optional</p>
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
import {useAnimalStore} from "~/stores/animalStore";

const store = useAnimalStore()

const props = defineProps({
  old: {type: Object, required: false}
})

const form = ref({
  identifier: '',
  name: '',
  sex: null,
  born_date: null,
  image: null,
  breed_id: null,
  classification_id: null,
  status_id: null,
  father_id: null,
  mother_id: null,
  farm_id: null
})
const localLogin = ref(false)

const identifierError = computed(() => {
  return store.formErrors.identifier ? store.formErrors.identifier[0] : '';
});
const nameError = computed(() => {
  return store.formErrors.name ? store.formErrors.name[0] : '';
});
const bornDateError = computed(() => {
  return store.formErrors.born_date ? store.formErrors.born_date[0] : '';
});

const sexError = computed(() => {
  return store.formErrors.sex ? store.formErrors.sex[0] : '';
});

const breedIdError = computed(() => {
  return store.formErrors.breed_id ? store.formErrors.breed_id[0] : '';
});

const motherIdError = computed(() => {
  return store.formErrors.mother_id ? store.formErrors.mother_id[0] : '';
});

const fatherIdError = computed(() => {
  return store.formErrors.father_id ? store.formErrors.father_id[0] : '';
});

const classificationIdError = computed(() => {
  return store.formErrors.classification_id ? store.formErrors.classification_id[0] : '';
});

const statusIdError = computed(() => {
  return store.formErrors.status_id ? store.formErrors.status_id[0] : '';
});

onMounted(() => {
  store.fetchParents('male')
  store.fetchParents('female')
  store.fetchBreeds()
  store.fetchClassifications()
  store.fetchAnimalStatus()

  if (props.old) {
    form.value = props.old
    form.value.breed_id = props.old.breed.id
    form.value.status_id = props.old.status.id
    form.value.classification_id = props.old.classification.id
    if (props.old.father)
      form.value.father_id = props.old.father.id
    if (props.old.mother)
      form.value.mother_id = props.old.mother.id

  }
})

</script>


<style scoped>

</style>