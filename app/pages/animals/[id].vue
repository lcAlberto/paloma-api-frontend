<template>
  <div class="">
    <div class="flex p-0 align-items-center justify-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">Edit Animal {{ animal_id || 'nada' }}</h2>
            <button
                class="btn btn-outline btn-primary"
                @click="router.back()"
            >
              <FontAwesomeIcon :icon="['fas', 'chevron-left']"/>
              Voltar
            </button>
          </div>
          <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
          <div class="py-5 w-full">
            <animals-animal-form
                v-if="!store.loading.fetchingAnimal"
                :old="store.animal"
            >
              <template #actions="{fomData}">
                <div
                    class="flex flex-col md:flex-row justify-end gap-5"
                >
                  <button
                      v-if="false"
                      class="btn btn-warning"
                  >
                    Desativar
                  </button>
                  <button
                      class="btn btn-error"
                      @click="confirmDelete = true"
                  >
                    Deletar
                  </button>
                  <button
                      class="btn btn-success"
                      @click="edit(fomData)"
                  >
                    Editar
                  </button>
                </div>
              </template>
            </animals-animal-form>
          </div>
        </div>
      </div>
    </div>
    <confirm
        v-model="confirmDelete"
        :message="`Tem certeza que deseja excluir ${animal.name}? Esta ação não pode ser desfeita.`"
        :title="`Confirmação de exclusão de ${animal.name}`"
        cancel-button-icon="fa fa-times"
        cancel-button-label="Cancelar"
        confirm-button-icon="fa fa-trash"
        confirm-button-label="Excluir"
        type="error"
        @confirm="submitDelete"
    />
  </div>
</template>
<script
    lang="ts"
    setup
>
import {useAnimalStore} from "~/stores/animalStore";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";
import type {BreadcrumbItem} from "@nuxt/ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Confirm from "~/components/ui/dialogs/confirm.vue";
// import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

const router = useRouter();
const route = useRoute();
const store = useAnimalStore()
const uiStore = useUiStore();

const animal_id = ref('')
const animal = computed(() => store.animal)
const confirmDelete = ref(false)

const edit = async (formData: AnimalFormInterface) => {
  if (animal_id.value.length === 0)
    return
  const response = await store.editAnimal(animal_id.value, formData)
  if (response) {
    uiStore.setToast({type: 'success', message: 'Animal created successfully.', title: 'Success.', delay: 5000});
    await router.push('/animals/')
  }
}

const submitDelete = async () => {
  if (animal_id.value.length === 0)
    return
  await store.destroyAnimal(parseInt(animal_id.value))
  await router.push('/animals/')
}

onMounted(() => {
  animal_id.value = route.params.id as string;
  if (animal_id.value) {
    store.fetchAnimal(animal_id.value);
  }
});
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/home'
  },
  {
    label: 'Animais',
    icon: 'i-lucide-box',
    to: '/animals'
  },
  {
    label: 'Edit',
    icon: 'i-lucide-box',
    to: `/animals/${animal_id.value}`
  },
]

definePageMeta({
  title: 'Edit Animal',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>