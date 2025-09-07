<template>
  <div
      :class="isExpanded ? 'w-64' : 'w-20'"
      class="transition-all duration-300 ease-in-out h-screen bg-gray-800 text-white flex flex-col p-4"
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
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
        >
          <UIcon
              :name="link.icon"
              class="text-xl"
          />

          <span
              v-if="isExpanded"
              class="ml-3"
          >{{ link.label }}</span>
          <div
              v-if="link.tag"
              class="badge badge-sm badge-outline badge-accent mx-2"
          >
            {{ link.tag }}
          </div>
        </NuxtLink>
      </div>
    </nav>

    <div class="mt-auto">
      <UButton
          :class="{ 'transform rotate-180': !isExpanded }"
          class="btn btn-ghost w-full"
          icon="i-heroicons-chevron-left"
          @click="$emit('toggle')"
      />
    </div>
  </div>
</template>

<script
    lang="ts"
    setup
>
const props = defineProps<{
  isExpanded: boolean
}>();
const emit = defineEmits<{
  (e: 'toggle'): void
}>();

const navigation = ref([
  {
    label: 'Dashboard',
    icon: 'i-lucide-chart-pie',
    to: '/home',
    can_access: true
  },
  {
    label: 'Animais',
    icon: 'i-lucide-box',
    to: '/animals'
  },
  {
    label: 'Ciclos Reprodutivos',
    icon: 'i-lucide-repeat',
    to: '/reproduction',
    can_access: true
  },
  {
    label: 'Tratamentos',
    icon: 'i-lucide-heart-pulse',
    to: '/health',
    tag: 'breve',
    disabled: true,
    can_access: false
  },
  {
    label: 'Fazendas',
    icon: 'i-lucide-user-check',
    to: '/farms',
    can_access: true
  },
  {
    label: 'Usuários',
    icon: 'i-lucide-users',
    to: '/users',
    can_access: true
  },
])

</script>