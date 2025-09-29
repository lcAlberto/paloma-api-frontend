import {defineStore} from "pinia";

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [] as ToastConfig[]
  }),
  actions: {
    setToast(config: Omit<ToastConfig, 'id'>) {
      const newToast: ToastConfig = {
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


export interface ToastConfig {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary' | 'light' | 'dark' | 'neutral';
  message: string;
  title: string | null;
  delay?: number | null;
  icon?: string | null;
  closable?: boolean | null;
  soft?: boolean | null;
  outline?: boolean | null;
}