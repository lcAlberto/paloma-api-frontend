<template>
  <div class="min-w-80 max-w-7xl ">
    <div
        :class="[colorClasses, 'alert', { 'alert-soft': toast.soft, 'alert-outline': toast.outline }]"
        class="flex flex-col shadow-lg relative"
    >
      <button
          v-if="toast.closable"
          class="absolute right-3"
          @click="close()"
      >
        <i class="fa fa-close"/>
      </button>
      <div class="flex items-center gap-2 w-full">
        <i :class="[toast.icon, 'text-2xl']"/>
        <h1
            v-if="toast.title"
            class="text-2xl font-semibold"
        >
          {{ toast.title }}
        </h1>
      </div>
      <span class="w-full">{{ toast.message }}</span>
      <progress
          v-if="toast.delay"
          :class="[progressColor, 'progress']"
          :value="currentProgress"
          class="w-full absolute bottom-0 opacity-25 left-0 h-[0.1rem]"
          max="100"
      />

    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
const props = defineProps({
  type: {
    type: String,
    default: 'neutral',
    validator: (value) => ['success', 'error', 'warning', 'info', 'neutral'].includes(value),
  },
  message: {type: String, default: 'Olá!'},
  timeout: {type: Number, default: 5},
  icon: {type: String, default: 'fa fa-info'},
  id: {type: Number, required: true},
  toast: {type: Object as () => ToastConfig, required: true},
});

const uiStore = useUiStore();

const currentProgress = ref(100);
let timerInterval: number | null = null;

const colorClasses = computed(() => {
  return {
    'alert-primary': props.toast.type === 'primary',
    'alert-success': props.toast.type === 'success',
    'alert-error': props.toast.type === 'error',
    'alert-warning': props.toast.type === 'warning',
    'alert-info': props.toast.type === 'info',
    'alert-neutral': props.toast.type === 'neutral',
  };
});
const progressColor = computed(() => {
  return {
    'bg-primary-50': props.toast.type === 'primary',
    'bg-success-50': props.toast.type === 'success',
    'bg-error-50': props.toast.type === 'error',
    'bg-warning-50': props.toast.type === 'warning',
    'bg-info-50': props.toast.type === 'info',
    'bg-neutral-50': props.toast.type === 'neutral',
  };
});

const close = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  uiStore.removeToast(props.id);
}

const startTimer = () => {
  const delay = props.toast.delay;

  if (!delay || delay <= 0) {
    return;
  }

  const duration = delay;
  const startTime = Date.now();

  timerInterval = setInterval(() => {
    const timeElapsed = Date.now() - startTime;
    const remainingTime = duration - timeElapsed;

    const percentage = Math.max(0, (remainingTime / duration) * 100);
    currentProgress.value = percentage;

    if (percentage <= 0) {
      clearInterval(timerInterval!);
    }
  }, 50);

}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>


<style scoped>
</style>