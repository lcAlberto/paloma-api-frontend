<template>
  <NuxtLayout>
    <NuxtPage/>
    <LazyUToaster/>
    <toast
        v-if="false"
        v-model="showSuccess"
        :timeout="5"
        icon="fa fa-check-circle"
        message="Bem-vindo! Tudo certo."
        type="success"
    />
  </NuxtLayout>
</template>
<script
    lang="ts"
    setup
>
import Toast from "~/components/layout/toast.vue";

const showSuccess = ref(true);
</script>