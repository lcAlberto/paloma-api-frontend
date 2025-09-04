<template>
  <div class="fixed top-10 right-10 min-w-80 max-w-7xl">
    <div
        :class="[colorClasses, 'alert']"
        class="text-end flex items-end shadow-lg"
    >
      <span>{{ message }}</span>
      <i :class="[icon, 'text-xl']"/>
      <!--      <i class="fa fa-circle"/>-->
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
const props = defineProps({
  modelValue: {type: Boolean, default: false},
  type: {
    type: String,
    default: 'neutral',
    validator: (value) => ['success', 'error', 'warning', 'info', 'neutral'].includes(value),
  },
  message: {type: String, default: 'Olá!',},
  timeout: {type: Number, default: 5,},
  icon: {type: String, default: 'fa fa-info',},
});

const emits = defineEmits(['update:modelValue', 'dismiss']);
const colorClasses = computed(() => {
  return {
    'alert-success': props.type === 'success',
    'alert-error': props.type === 'error',
    'alert-warning': props.type === 'warning',
    'alert-info': props.type === 'info',
    'alert-neutral': props.type === 'neutral',
  };
});

watch(() => props.modelValue, (value) => {
  console.log(value);
  if (value)
    setTimeout(() => {
      emits('update:modelValue', false);
      emits('dismiss');
    }, props.timeout * 1000);
})
</script>


<style scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  z-index: 1000;
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

</style>