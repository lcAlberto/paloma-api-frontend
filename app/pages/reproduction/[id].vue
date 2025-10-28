<template>
  <div class="">
    <div class="flex p-0 align-items-center justify-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">Edit Ciclo reprodutivo</h2>
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
            <reproduction-form
                v-if="!store.loading.fetchingReproduction"
                :old="store.reproduction"
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
            </reproduction-form>
          </div>
        </div>
      </div>
    </div>
    <confirm
        v-if="reproduction"
        v-model="confirmDelete"
        :message="`Tem certeza que deseja excluir ${reproduction?.id}? Esta ação não pode ser desfeita.`"
        :title="`Confirmação de exclusão de ${reproduction?.id}`"
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
import type {BreadcrumbItem} from "@nuxt/ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Confirm from "~/components/ui/dialogs/confirm.vue";
import type {ReproductiveCycleFormInterface} from "~/types/ReproductiveCycleFormInterface";

const router = useRouter();
const route = useRoute();
const store = useReproductionStore()
const uiStore = useUiStore();

const reproduction_id = ref('')
const reproduction = computed(() => store.reproduction)
const confirmDelete = ref(false)

const edit = async (formData: ReproductiveCycleFormInterface) => {
  if (reproduction_id.value.length === 0)
    return
  const response = await store.editReproduction(reproduction_id.value, formData)
  if (response) {
    uiStore.setToast({type: 'success', message: 'Cycle created successfully.', title: 'Success.', delay: 5000});
    await router.push('/reproduction/')
  }
}

const submitDelete = async () => {
  if (reproduction_id.value.length === 0)
    return
  await store.deleteReproduction(parseInt(reproduction_id.value))
  await router.push('/reproduction/')
}

onMounted(() => {
  reproduction_id.value = route.params.id as string;
  if (reproduction_id.value) {
    store.fetchReproduction(reproduction_id.value);
  }
});
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
    label: 'Edit',
    icon: 'i-lucide-box',
    to: `/reproduction/${reproduction_id.value}`
  },
]

definePageMeta({
  title: 'Edit Cycle',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>