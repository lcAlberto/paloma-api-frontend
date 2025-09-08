<template>
  <div class="flex-1 w-full">
    <div
        class="collapse p-4 bg-base-200 rounded-b-none rounded-t-xl items-center gap-2"
    >
      <input
          v-model="isOpenFilter"
          class="peer hidden"
          type="checkbox"
      >
      <div class="collapse-title p-0 bg-primary-100 rounded-t-xl font-medium flex items-center justify-between gap-2">
        <div class="flex place-items-stretch gap-3 w-1/2">
          <UInput
              v-model="filters.identifier"
              class="input w-full"
              placeholder="Identificador, brinco"
          />
          <USelectMenu
              v-model="filters.breed"
              :options="availableBreds"
              class="select w-full"
              placeholder="Fazenda"
          />
        </div>
        <button>
          <UButton
              :trailing-icon="isOpenFilter ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
              color="neutral"
              size="md"
              variant="ghost"
              @click="isOpenFilter = !isOpenFilter"
          >Mais filtros
          </UButton>
        </button>
      </div>
      <div
          :class="{ 'hidden': !isOpenFilter }"
          class="collapse-content flex py-4 px-0 bg-base-200 rounded-t-xl items-center gap-2"
      >
        <UInput
            v-model="filters.identifier"
            class="input"
            placeholder="Identificador"
        />
        <USelectMenu
            v-model="filters.breed"
            :options="availableBreds"
            class="select"
            placeholder="Fazenda"
        />
      </div>
    </div>
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
      <UPagination
          :model-value="pagination.pageIndex + 1"
          :page-count="pagination.pageSize"
          :total="store.totalCount"
          :ui="{
            root: 'btn btn-sm',
            ellipsis: 'btn btn-sm',
            prev: 'btn btn-sm btn-ghost',
            next: 'btn btn-sm btn-ghost',
            list: 'btn-group',
          }"
          active-color="primary"
          @update:model-value="updatePageAndFilters"
      />
    </div>
  </div>
</template>
<script
    lang="ts"
    setup
>
import type {UTable} from "#components";
import {useClipboard, useDebounceFn} from '@vueuse/core'

const store = useAnimalStore();
const route = useRoute();
const router = useRouter();

const availableBreds = computed(() => store.breeds || []);
const isOpenFilter = ref(false);

const loading = computed(() => store.loading.fetched || false);

const table = ref<InstanceType<typeof UTable> | null>(null);

const rowSelection = ref({});

const filters = ref({
  identifier: route.query.identifier || null,
  name: route.query.name || null,
  status: route.query.status || null,
  breed: route.query.breed || null,
  classification: route.query.classification || null,
  mother: route.query.mother || null,
  father: route.query.father || null,
  sex: route.query.sex || null,
  born_date_from: route.query.born_date_from || null,
});

const updatePageAndFilters = () => {
  const newQuery = {
    page: pagination.value.pageIndex + 1,
    page_size: pagination.value.pageSize,
    ...filters.value,
  };
  router.push({query: newQuery});
};

const pagination = ref({
  pageIndex: parseInt(route.query.page) - 1 || 0,
  pageSize: parseInt(route.query.page_size) || 10,
});

const updateUrl = () => {
  const newQuery = {
    ...filters.value,
    page: pagination.value.pageIndex + 1,
    page_size: pagination.value.pageSize,
  };

  Object.keys(newQuery).forEach(key => newQuery[key] == null || newQuery[key] === '' && delete newQuery[key]);

  router.push({query: newQuery});
};

const debouncedUpdateUrl = useDebounceFn(updateUrl, 500);


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

const fetchAnimals = () => {
  store.fetchAnimals(pagination.value.pageIndex + 1, pagination.value.pageSize);
};

watch(filters, (newFilters) => {
  pagination.value.pageIndex = 0;
  if (newFilters.identifier !== route.query.search) {
    debouncedUpdateUrl();
  } else {
    updateUrl();
  }
}, {deep: true});

watch(() => route.query, (newQuery) => {
  pagination.value.pageIndex = parseInt(newQuery.page) - 1 || 0;
  pagination.value.pageSize = parseInt(newQuery.page_size) || 10;
  filters.value.identifier = route.query.identifier;
  filters.value.name = route.query.name;
  filters.value.status = route.query.status;
  filters.value.breed = route.query.breed;
  filters.value.classification = route.query.classification;
  filters.value.mother = route.query.mother;
  filters.value.father = route.query.father;

  store.fetchAnimals(newQuery);
}, {deep: true, immediate: true});

onMounted(() => {
  fetchAnimals(route.query);
});
</script>


<style scoped>

</style>