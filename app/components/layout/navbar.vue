<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <select-farm-navbar/>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div
            class="btn btn-ghost btn-circle avatar"
            role="button"
            tabindex="0"
        >
          <div class="w-10 rounded-full">
            <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            >
          </div>
        </div>
        <ul
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            tabindex="0"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>

import SelectFarmNavbar from "~/components/layout/navbar/select-farm-navbar.vue";
</script>


<style scoped>

</style>