<template>
  <div
      :data-theme="authStore.userTheme"
      class="flex"
  >
    <sidebar
        :is-expanded="isExpanded"
        @toggle="isExpanded = !isExpanded"
    />
    <main class="flex-grow bg-base-300">
      <navbar/>
      <div class="px-8">
        <!--      <div class="xl:max-w-3/4 px-8 mx-auto">-->
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
import navbar from '~/components/layout/navbar.vue'
import Sidebar from "~/components/layout/sidebar.vue";
import Breadcrumb from "~/components/layout/breadcrumb.vue";

const isExpanded = ref(true);

const authStore = useAuthStore();

</script>


<style scoped>

</style>