<template>
  <div class="">
    <div class="flex p-0 align-items-center justify-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">New Animal Register!</h2>
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
            <animals-animal-form>
              <template #actions="{fomData}">
                <div
                    class="flex flex-col md:flex-row justify-end gap-5"
                >
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
        </div>
      </div>
    </div>
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

const router = useRouter();
const store = useAnimalStore()
const uiStore = useUiStore();

const create = async (formData: AnimalFormInterface) => {
  const response = await store.createAnimal(formData)
  if (response) {
    uiStore.setToast({type: 'success', message: 'Animal created successfully.', title: 'Success.', delay: 5000});
    await router.push('/animals/')
  }
}

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
    label: 'Register',
    icon: 'i-lucide-box',
    to: '/animals/create'
  },
]

definePageMeta({
  title: 'Create Animals',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>