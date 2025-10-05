<template>
  <NuxtLayout>
    <NuxtPage/>
    <LazyUToaster/>
    <div class="fixed top-20 right-10 z-50 flex flex-col gap-5">
      <toast
          v-for="toast in uiStore.toasts"
          :id="toast.id"
          :key="toast.id"
          :toast="toast"
      />
    </div>
  </NuxtLayout>
</template>
<script
    lang="ts"
    setup
>
import Toast from "~/components/ui/dialogs/toast.vue";
import {useUiStore} from '~/stores/ui';

const uiStore = useUiStore();

watch(() => uiStore.toasts, (newToasts) => {
  const latestToast = newToasts[newToasts.length - 1];

  if (latestToast && latestToast.delay) {
    setTimeout(() => {
      uiStore.removeToast(latestToast.id);
    }, latestToast.delay);
  }
}, {deep: true});


/*Tests*/
const openToast = () => {
  const uiStore = useUiStore();
  uiStore.setToast({
    title: 'Sucesso',
    message: 'Animal cadastrado com sucesso!',
    type: 'success',
    icon: 'fa fa-check',
    delay: 3000,
    soft: true,
    closable: true
  });
  uiStore.setToast({
    title: 'Primary',
    message: 'Animal cadastrado com sucesso!',
    type: 'primary',
    icon: 'fa fa-check',
    delay: 3000,
    closable: true
  });
  uiStore.setToast({
    title: 'Warning',
    message: 'Animal cadastrado com sucesso!',
    type: 'warning',
    icon: 'fa fa-check',
    delay: 3000,
    closable: true,
    soft: true,
    outline: true
  });
  uiStore.setToast({
    title: 'Info',
    message: 'Animal cadastrado com sucesso!',
    type: 'info',
    icon: 'fa fa-check',
    delay: 3000,
    closable: true
  });
  uiStore.setToast({
    title: 'Error',
    message: 'Animal cadastrado com sucesso!',
    type: 'error',
    icon: 'fa fa-check',
    delay: 3000,
    closable: true
  });
}
</script>