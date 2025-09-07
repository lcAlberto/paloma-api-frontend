<template>
  <div
      class="flex"
      data-theme="cupcake"
  >
    <sidebar
        :is-expanded="isExpanded"
        @toggle="isExpanded = !isExpanded"
    />
    <main class="flex-grow bg-gray-300">
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
import navbar from '~/components/layout/navbar.vue'
import Sidebar from "~/components/layout/sidebar.vue";
import Breadcrumb from "~/components/layout/breadcrumb.vue";

const isExpanded = ref(true);

</script>


<style scoped>

</style>