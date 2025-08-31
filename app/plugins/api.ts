import { $fetch } from 'ofetch';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const tokenCookie = useCookie<string | null>('token');

  console.log('API Base URL:', config.public.apiBaseUrl);
  console.log('Tem cookie token:', tokenCookie.value);

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    async onRequest({ options }): Promise<void> {
      console.log('Fazendo requisição para:', options);
      if (tokenCookie.value) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${tokenCookie.value}`;
      }
    },
    async onResponseError({ response }) {
      console.log('é um erro de resposta da api', response);
      if (response && response.status === 401) {
        console.error('Unauthorized. Redirecting to login...');
        tokenCookie.value = null;
        router.push('/login');
      }
    }
  });

  return {
    provide: {
      api: api
    }
  };
});