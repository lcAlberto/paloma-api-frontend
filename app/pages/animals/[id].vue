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
                  <button class="btn btn-warning">
                    Desativar
                  </button>
                  <button class="btn btn-error">
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
  </div>
</template>
<script
    lang="ts"
    setup
>
import {useAnimalStore} from "~/stores/animalStore";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";
import type {BreadcrumbItem} from "@nuxt/ui";
// import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

const router = useRouter();
const route = useRoute();
const store = useAnimalStore()

const animal_id = ref('')

const edit = async (formData: AnimalFormInterface) => {
  console.log(animal_id.value, route.params.id);
  if (animal_id.value.length === 0)
    return
  await store.editAnimal(animal_id.value, formData)
}

onMounted(() => {
  animal_id.value = route.params.id as string;
  if (animal_id.value) {
    store.fetchAnimal(animal_id.value);
    // router.push('/animals/')
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