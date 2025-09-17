<template>
  <div class="">
    <div class="row p-0 align-items-center">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="w-full flex justify-between">
            <h2 class="card-title">Card title!</h2>
            <button
                class="btn btn-primary"
                @click="router.push('/animals/create')"
            >
              New Animal
            </button>
          </div>
          <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
          <animals-datalist/>
        </div>
      </div>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
const router = useRouter();
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
  }
]

definePageMeta({
  title: 'Animais',
  breadcrumb: breadcrumbItems,
  auth: true,
})
</script>


<style scoped>

</style>