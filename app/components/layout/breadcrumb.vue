<template>
  <div class="">
    <div class="card">
      <div class="card-body px-0 py-4">
        <UBreadcrumb
            :items="items"
            class="text-base-100"
        />
      </div>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import type {BreadcrumbItem} from '@nuxt/ui'

const route = useRoute()

const items = computed<BreadcrumbItem[]>(() => {
  const breadcrumbItems: BreadcrumbItem[] = [
    // {
    //   label: 'Home',
    //   icon: 'i-lucide-house',
    //   to: '/home'
    // }
  ]

  const routeMetaBreadcrumb = route.meta.breadcrumb as BreadcrumbItem[] | undefined

  if (routeMetaBreadcrumb) {
    breadcrumbItems.push(...routeMetaBreadcrumb)
  }

  return breadcrumbItems
});
</script>

