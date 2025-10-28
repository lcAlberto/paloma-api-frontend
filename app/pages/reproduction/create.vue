<template>
  <div class="">
    <div class="flex p-0 align-items-center justify-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">New Reproduction Register!</h2>
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
            <reproduction-form>
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
            </reproduction-form>
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
import type {BreadcrumbItem} from "@nuxt/ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {ReproductiveCycleFormInterface} from "~/types/ReproductiveCycleFormInterface";

const router = useRouter();
const store = useReproductionStore()
const uiStore = useUiStore();

const create = async (formData: ReproductiveCycleFormInterface) => {
  const response = await store.createReproduction(formData)
  if (response) {
    uiStore.setToast({
      type: 'success',
      message: 'New reproduction cycle created successfully.',
      title: 'Success.',
      delay: 5000
    });
    await router.push('/reproduction/')
  }
}

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/home'
  },
  {
    label: 'Reproduction',
    icon: 'i-lucide-box',
    to: '/reproduction'
  },
  {
    label: 'Register',
    icon: 'i-lucide-box',
    to: '/reproduction/create'
  },
]

definePageMeta({
  title: 'Add new reprocuction record',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>