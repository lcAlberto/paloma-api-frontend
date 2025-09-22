<template>
  <div class="flex flex-col w-full">
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
    >
      <template #actions-cell="{ row }">
        <div>
          <dropdown
              :options="actionList"
              option-label="label"
              option-value="value"
              placeholder="Ações"
              position="dropdown-left"
              @selected="(action) => dispatchAction(action, row.original)"
          />
        </div>
      </template>
    </UTable>
    <div class="flex justify-center pt-4">
      <div v-if="pagination.total_pages > 1">
        <default-pagination
            :pagination="pagination"
            @update:page="handlePageUpdate"
        />
      </div>
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
import DefaultPagination from "~/components/layout/default-pagination.vue";
import type {Pagination} from "~/types/PaginationInterface";
import Dropdown from "~/components/layout/listagem/dropdown.vue";

const store = useAnimalStore();
const router = useRouter();

const loading = computed(() => store.loading.fetched || false);
const pagination = computed(() => store.animalsPagination);

const table = ref<InstanceType<typeof UTable> | null>(null);

const rowSelection = ref({});

const params = useUrlSearchParams('history');

const handlePageUpdate = (page: number) => {
  // currentPage.value = page;
  params.page = String(page);
};

watch(params, async (newParams) => {
  const query = Object.fromEntries(
      Object.entries(newParams).filter(([key, value]) => value !== null && value !== undefined && value !== '')
  );

  await store.fetchAnimals(query);
}, {immediate: true, deep: true});

onMounted(() => {
  store.fetchAnimals();
});

const actionList = [
  {value: 'show', label: 'Ficha técnica'},
  {value: 'delete', label: 'Excluir'},
]

const dispatchAction = (action: string, item: object) => {
  switch (action) {
    case 'show':
      router.push(`/animals/${item.id}`)
      break
    case 'delete':
      store.destroyAnimal(item.id)
      break
  }
}

const columns = [
  {
    accessorKey: 'identifier',
    header: 'Identificador',
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
    id: 'actions',
    header: 'Ações',
    // cell: ({row}) => {
    //   const animalId = row.original.id;
    //   const goToDetails = () => {
    //     router.push(`/animals/${animalId}`);
    //   };
    //
    //   const deleteAnimal = async () => {
    //     await store.destroyAnimal(animalId);
    //   };
    //   const editButton = h('div', {
    //     class: 'inline-block',
    //     onClick: goToDetails,
    //   }, h('UButton', {
    //     icon: 'i-heroicons-pencil-square-20-solid',
    //     color: 'gray',
    //     variant: 'ghost',
    //     label: 'Editar',
    //   }));
    //
    //   const deleteButton = h('div', {
    //     class: 'inline-block',
    //     onClick: deleteAnimal,
    //   }, h('UButton', {
    //     icon: 'i-heroicons-trash-20-solid',
    //     color: 'red',
    //     variant: 'ghost',
    //     label: 'Excluir',
    //   }));
    //
    //   return h('div', {
    //     class: 'flex items-center gap-2'
    //   }, [editButton, deleteButton]);
    // },
  },
];
</script>


<style scoped>

</style>