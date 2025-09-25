<template>
  <div
      :class="isExpanded ? 'w-64' : 'w-20'"
      class="transition-all duration-300 ease-in-out h-screen bg-primary text-white flex flex-col p-4"
  >
    <div class="flex items-center justify-center p-4">
      <img
          v-if="isExpanded"
          alt="Logo"
          class="h-8"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
      >
      <img
          v-else
          alt="Icon"
          class="h-8"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
      >
    </div>

    <nav class="mt-8 flex-grow space-y-2">
      <div
          v-for="link in navigation"
          :key="link.to"
      >
        <NuxtLink
            :class="{
              'justify-center': !isExpanded,
                'cursor-not-allowed opacity-50': link?.disabled
          }"
            :disabled="link?.disabled"
            :to="link?.to || '#'"
            active-class="text-primary bg-base-100"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700 relative"
        >
          <i
              :class="link.icon"
              class="text-xl"
          />

          <span
              v-if="isExpanded"
              class="ml-3"
          >{{ link.label }}</span>
          <div
              v-if="link.tag"
              :class="{'p-0': !isExpanded}"
          >
            <span
                v-if="isExpanded"
                class="badge badge-xs badge-outline badge-accent mx-2"
            >{{ link.tag }}</span>
            <i
                v-else
                class="fa-solid fa-hourglass text-xs absolute bottom-0 text-accent"
            />
          </div>
        </NuxtLink>
      </div>
    </nav>

    <div class="mt-auto">
      <button
          :class="{ 'transform rotate-180': !isExpanded }"
          class="btn btn-ghost rounded-xl w-full"
          @click="emits('toggle')"
      >
        <i class="fas fa-chevron-left"/>
      </button>
    </div>
  </div>
</template>

<script
    lang="ts"
    setup
>
const props = defineProps({
  isExpanded: {type: Boolean, required: true}
})

const emits = defineEmits(['toggle']);

const navigation = ref([
  {
    label: 'Dashboard',
    icon: 'fas fa-chart-area',
    to: '/home',
    can_access: true
  },
  {
    label: 'Animais',
    icon: 'fas fa-cow',
    to: '/animals'
  },
  {
    label: 'Ciclos Reprodutivos',
    icon: 'fas fa-arrows-spin',
    to: '/reproduction',
    can_access: true
  },
  {
    label: 'Tratamentos',
    icon: 'fas fa-heart-pulse',
    to: '/health',
    tag: 'breve',
    disabled: true,
    can_access: false
  },
  {
    label: 'Infraestrutura',
    icon: 'fas fa-tractor',
    to: '/health',
    tag: 'breve',
    disabled: true,
    can_access: false
  },
  {
    label: 'Fazendas',
    icon: 'fas fa-building-wheat',
    to: '/farms',
    can_access: true
  },
  {
    label: 'Usuários',
    icon: 'fas fa-users',
    to: '/users',
    can_access: true
  },
])

</script>