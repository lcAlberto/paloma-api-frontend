<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <select-farm-navbar v-if="authStore.user?.farms?.length > 0"/>
      <div
          v-else
          class="btn btn-outline text-xl"
      >
        <i class="fa-solid fa-building-wheat"/>
        {{ authStore.currentFarm.name }}
      </div>
    </div>
    <div class="flex-none">
      <dropdown
          :options="endDropdownOptions"
          button-class="btn btn-ghost btn-circle avatar ring-primary hover:ring-2"
          position="dropdown-end"
          @selected="item => handleAction(item)"
      >
        <template #activator>
          <div class="w-10 rounded-full">
            <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            >
          </div>
        </template>
      </dropdown>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>

import SelectFarmNavbar from "~/components/layout/navbar/select-farm-navbar.vue";
import Dropdown from "~/components/layout/listagem/dropdown.vue";

const authStore = useAuthStore();

const endDropdownOptions = ref([
  {value: 'profile', label: 'Meus dados', icon: 'fa-user'},
  {value: 'subscription', label: 'Assinatura', icon: 'fa-hand-holding-dollar'},
  {value: 'settings', label: 'Configurações', icon: 'fa-gear'},
  {value: 'logout', label: 'Sair', icon: 'fa-door-open'}
])


const handleAction = (action: string) => {
  console.log(action)
  if (action === 'logout') {
    authStore.logout()
  } else {
    const router = useRouter()
    router.push(action)
  }
}
</script>


<style scoped>

</style>