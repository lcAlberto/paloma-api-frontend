<template>
  <div class="flex-1 w-full">
    <filters/>
    <UTable
        ref="table"
        v-model:row-selection="rowSelection"
        :columns="columns"
        :data="store.animals"
        :loading="loading"
        :ui="{
          base: 'table w-full',
          thead: 'bg-base-200 py-2 rounded-t-xl',
          th: 'py-2',
        }"
        class="flex-1 border border-base-200 rounded-b-xl w-full"
        sticky
    />
    <div class="flex justify-center pt-4">
      <div v-if="pagination.per_page >= pagination.total_count">
        <div class="join">
          <!--          <input-->
          <!--              v-for="page in pagination.total_pages"-->
          <!--              :aria-label="`${page}`"-->
          <!--              class="join-item btn btn-square"-->
          <!--              name="options"-->
          <!--              type="radio"-->
          <!--              @click="setPagination(page)"-->
          <!--          >-->
        </div>
      </div>
      <!--      <UPagination-->
      <!--          :model-page="paginationState.page"-->
      <!--          :total="store.animalsPagination.total_count"-->
      <!--          :ui="{-->
      <!--        root: 'btn btn-sm',-->
      <!--        ellipsis: 'btn btn-sm',-->
      <!--        prev: 'btn btn-sm btn-ghost',-->
      <!--        next: 'btn btn-sm btn-ghost',-->
      <!--        list: 'btn-group',-->
      <!--      }"-->
      <!--          active-color="primary"-->
      <!--          @update:model-value="updatePage"-->
      <!--      />-->
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import type {UTable} from "#components";
import {useClipboard, useDebounceFn} from '@vueuse/core'
import Filters from "~/components/animals/filters.vue";

const store = useAnimalStore();
const route = useRoute();
const router = useRouter();

const loading = computed(() => store.loading.fetched || false);
const pagination = computed(() => store.animalsPagination);

const table = ref<InstanceType<typeof UTable> | null>(null);

const rowSelection = ref({});

const paginationState = ref({
  page: parseInt(route.query.page as string) || 1,
  pageSize: parseInt(route.query.page_size as string) || 10
});

const updatePage = (page: number) => {
  const newQuery = {...route.query, page: page};
  router.push({query: newQuery});
};

const fetchAnimals = () => {
  store.fetchAnimals(route.query);
};

const debouncedFetchAnimals = useDebounceFn(() => {
  store.fetchAnimals(route.query);
}, 500);

watch(() => route.query, (newQuery) => {
  console.log('URL mudou, buscando animais:', newQuery);
  paginationState.value.page = parseInt(newQuery.page as string) || 1;
  paginationState.value.pageSize = parseInt(newQuery.page_size as string) || 10;
  debouncedFetchAnimals();
}, {deep: true, immediate: true});

onMounted(() => {
  fetchAnimals();
});

const columns = [
  {
    accessorKey: 'identifier',
    header: 'Identificador',
    cell: ({row}) => {
      const identifier = row.getValue('identifier');
      const toast = useToast();
      const {copy} = useClipboard({legacy: true});

      const copyToClipboard = () => {
        copy(identifier);
        toast.add({
          title: 'Identificador copiado!',
          icon: 'i-heroicons-information-circle',
          color: 'primary',
        });
      };

      return h('div', {
        class: 'cursor-pointer hover:underline',
        onClick: copyToClipboard,
      }, identifier);
    },
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({row}) => {
      const sex = row.original.sex;
      const icon = sex === 'male' ? 'i-heroicons-face-male' : 'i-heroicons-face-female';

      return h('i', {
        class: icon,
        style: {fontSize: '1.5em'}
      });
    },
  },
  {
    accessorKey: 'born_date',
    header: 'Data de Nascimento',
    cell: ({row}) => {
      const date = row.getValue('born_date');
      return date ? new Date(date).toLocaleDateString('pt-BR') : '';
    },
  },
  {
    accessorKey: 'classification',
    header: 'Classificação',
    cell: ({row}) => {
      const classification = row.original.classification;
      if (!classification || !classification.id) return 'N/A';
      return h('span', {}, classification.name);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const status = row.original.status;
      const statusMap = {
        'active': {color: 'success', label: 'Ativo'},
        'inactive': {color: 'neutral', label: 'Inativo'},
        'dead': {color: 'warning', label: 'Morto'},
        'sold': {color: 'info', label: 'Vendido'},
      };

      const statusInfo = statusMap[status] || {color: 'gray', label: status};

      return h('span', {class: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800 dark:bg-${statusInfo.color}-900 dark:text-${statusInfo.color}-200`}, statusInfo.label);
    },
  },
  {
    accessorKey: 'breed',
    header: 'Raça',
    cell: ({row}) => {
      const breed = row.original.breed;
      if (!breed || !breed.id) return 'N/A';
      return h('span', {}, breed.name);
    },
  },
  {
    accessorKey: 'father_id',
    header: 'Pai',
    cell: ({row}) => {
      const father = row.original.father;
      if (!father) return 'N/A';
      return h('a', {
        href: `/animals/${father.id}`,
        class: 'text-primary hover:underline'
      }, father.name);
    },
  },
  {
    accessorKey: 'mother_id',
    header: 'Mãe',
    cell: ({row}) => {
      const mother = row.original.mother;
      if (!mother || !mother.id) return 'N/A';
      return h('a', {
        href: `/animals/${mother.id}`,
        class: 'text-primary hover:underline'
      }, mother.name);
    },
  },
  {
    key: 'actions',
    header: 'Ações',
    cell: ({row}) => {
      const animalId = row.original.id;
      const goToDetails = () => {
        router.push(`/animals/${animalId}`);
      };

      const deleteAnimal = async () => {
        await store.destroyAnimal(animalId);
      };
      const editButton = h('div', {
        class: 'inline-block',
        onClick: goToDetails,
      }, h('UButton', {
        icon: 'i-heroicons-pencil-square-20-solid',
        color: 'gray',
        variant: 'ghost',
        label: 'Editar',
      }));

      const deleteButton = h('div', {
        class: 'inline-block',
        onClick: deleteAnimal,
      }, h('UButton', {
        icon: 'i-heroicons-trash-20-solid',
        color: 'red',
        variant: 'ghost',
        label: 'Excluir',
      }));

      return h('div', {
        class: 'flex items-center gap-2'
      }, [editButton, deleteButton]);
    },
  },
];
</script>


<style scoped>

</style>