<template>
  <div class="join">
    <button
        :disabled="!pagination.previous"
        class="join-item btn btn-square"
        @click="goToPage(pagination.previous!)"
    >
      «
    </button>

    <button
        v-for="page in totalPageNumbers"
        :key="page"
        :class="{'btn-active': page === pagination.current_page}"
        class="join-item btn"
        @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
        :disabled="!pagination.next"
        class="join-item btn btn-square"
        @click="goToPage(pagination.next!)"
    >
      »
    </button>
  </div>
</template>

<script
    lang="ts"
    setup
>
import {computed} from 'vue';
import type {Pagination} from "~/types/PaginationInterface";

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
}>();

const props = defineProps<{
  pagination: Pagination;
}>();

const totalPageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= props.pagination.total_pages; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page: number) => {
  if (page) {
    emit('update:page', page);
  }
};
</script>