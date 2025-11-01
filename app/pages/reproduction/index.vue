<template>
  <div class="">
    <div class="row p-0 align-items-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">Ciclos Reprodutivos</h2>
            <NuxtLink
                class="btn btn-primary"
                to="/reproduction/create"
            >
              New Cycle
            </NuxtLink>
          </div>
          <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
          <reproduction-datalist/>
          AAA{{ store.openModalReproductionInfo }}
          <predicted-calving-info-modal/>
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
import PredictedCalvingInfoModal from "~/components/reproduction/predicted-calving-info-modal.vue";

const store = useReproductionStore()

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/home'
  },
  {
    label: 'Ciclos Reprodutivos',
    icon: 'i-lucide-box',
    to: '/reproduction'
  }
]

definePageMeta({
  title: 'Ciclos Reprodutivos',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>