import type {RouteLocationNormalized} from "#vue-router";

export default defineNuxtRouteMiddleware((to:RouteLocationNormalized) => {
  const token = useCookie('token').value;
  console.log('middlewate');
  console.log('qual o nome da rota? ', to.name)

  const isProtectedRoute = to.meta.auth;
  const isLoginPage = to.name === 'login';


  if (isProtectedRoute && !token) {
    if (!isLoginPage) {
      return navigateTo('/login');
    }
  }

  if (isLoginPage && token) {
    return navigateTo('/');
  }
});
