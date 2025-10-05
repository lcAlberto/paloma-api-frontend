export interface ToastInterface {
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