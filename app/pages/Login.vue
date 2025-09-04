<template>
  <div class="hero md:min-h-screen md:w-min">
    <div class="md:min-w-96 h-screen md:h-min flex-col px-4 py-8 backdrop-blur-xs rounded-2xl shadow-2xl border-2 border-base-100/30 light:bg-base-50 dark:bg-base-100/70">
      <div class="text-center flex flex-col items-center max-w-sm lg:text-left z-10 shrink-1">
        <img
            alt="logo"
            class="max-w-2xs mx-auto lg:mx-0 mb-4"
            src="/logo/logo-4.png"
        >
        <div>
          <h1 class="text-3xl">Login now!</h1>
          <p class="pt-2">
            Tenha controle sobre seu rebanho, registre e acompanhe a saúde e produtividade de cada animal de forma
            simples
            e eficiente.
          </p>
        </div>
      </div>
      <USeparator/>
      <div class="card sw-full shrink-0">
        <div class="card-body px-0 w-full">
          <UForm
              :schema="schema"
              :state="state"
              @submit="onSubmit"
          >
            <fieldset class="fieldset">
              <label class="label">Email</label>
              <input
                  v-model="state.email"
                  class="input focus:outline-0 focus:border-gray-400 w-full"
                  placeholder="Email"
                  type="text"
              >
              <label class="label">Password</label>
              <input
                  v-model="state.password"
                  class="input focus:outline-0 focus:border-gray-400 w-full"
                  placeholder="Password"
                  type="password"
              >
              <div><a class="link link-hover">Forgot password?</a></div>

              <UButton
                  class="btn btn-neutral mt-4"
                  type="submit"
              >
                Submit
              </UButton>
              <div @click="testToast">
                <a class="link link-hover">Forgot password?</a>
              </div>
            </fieldset>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script
    lang="ts"
    setup
>
import * as z from 'zod'
import type {FormSubmitEvent} from "#ui/types";

const router = useRouter();
const tokenCookie = useCookie('token');
const {$api} = useNuxtApp();

const schema = z.object({
  email: z.string(),
  // email: z.string().email('Invalid email'),
  password: z.string().min(4, 'Must be at least 4 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const errorMessage = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await $api('/v1/users/login/', {
      method: 'POST',
      body: {
        username: event.data.email,
        password: event.data.password
      }
    });
    console.log('Login successful:', response);
    tokenCookie.value = response.access;
    await router.push('/home');
  } catch (error: object) {
    if (error && error.data && error.data.detail) {
      errorMessage.value = error.data.detail;
    }
    console.error('Login failed:', error);
  }
}

definePageMeta({
  layout: 'guest',
  auth: false,
});
</script>

<style scoped>

</style>