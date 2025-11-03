<template>
  <div
      :data-theme="authStore.userTheme"
      class="flex"
  >
    <sidebar
        :is-expanded="isExpanded"
        @toggle="isExpanded = !isExpanded"
    />
    <main class="flex-grow bg-base-300 overflow-hidden h-screen">
      <navbar/>
      <div class="px-8">
        <breadcrumb/>
        <slot/>
      </div>
    </main>
  </div>
</template>

<script
    lang="ts"
    setup
>
import navbar from '~/components/ui/navbar.vue'
import Sidebar from "~/components/ui/sidebar.vue";
import Breadcrumb from "~/components/ui/breadcrumb.vue";

const isExpanded = ref(true);

const authStore = useAuthStore();

</script>


<style scoped>

</style>