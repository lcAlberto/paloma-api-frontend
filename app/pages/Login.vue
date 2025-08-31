<template>
<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from "#ui/types";
// import type { FormSubmitEvent } from '@nuxt/ui'
const router = useRouter();
const tokenCookie = useCookie('token');
const { $api } = useNuxtApp();

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

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('submetendo login');
  try {
    const response = await $api('/v1/users/login/', {
      method: 'POST',
      body: {
        username: event.data.email,
        password: event.data.password
      }
    });
    console.log(response);

    tokenCookie.value = response.token;
    await router.push('/');
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: 'Login error', color: 'error' })
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