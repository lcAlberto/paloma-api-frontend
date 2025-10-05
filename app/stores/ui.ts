import {defineStore} from "pinia";
import type {ToastInterface} from "~/types/ToastInterface";

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [] as ToastInterface[],
  }),
  actions: {
    setToast(config: Omit<ToastInterface, 'id'>) {
      const newToast: ToastInterface = {
        id: Date.now() + Math.random(),
        ...config
      };

      this.toasts.push(newToast);
    },

    removeToast(id: number) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    },
  },
});