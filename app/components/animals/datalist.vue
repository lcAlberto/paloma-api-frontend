<template>
  <div class="flex flex-col w-full max-h-[70vh] overflow-y-auto">
    <div class="">
      <filters/>
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
    >
      <template #actions-cell="{ row }">
        <div>
          <dropdown
              :icon="['fas', 'fa-ellipsis-vertical']"
              :options="actionList"
              option-label="label"
              option-value="value"
              position="dropdown-left"
              @selected="(action) => dispatchAction(action, row.original)"
          />
        </div>
      </template>
    </UTable>
    <div class="flex justify-center pt-4 sticky bottom-0 w-full bg-base-100">
      <div v-if="pagination.total_pages > 1">
        <default-pagination
            :pagination="pagination"
            @update:page="handlePageUpdate"
        />
      </div>
    </div>
    <confirm
        v-model="confirmDelete"
        :message="`Tem certeza que deseja excluir <b>${animalToDeleteName}</b>? Esta ação não pode ser desfeita.`"
        cancel-button-icon="fa fa-times"
        cancel-button-label="Cancelar"
        confirm-button-icon="fa fa-trash"
        confirm-button-label="Excluir"
        title="Confirmação de exclusão"
        type="error"
        @confirm="submitDelete"
    />
  </div>
</template>
<script
    lang="ts"
    setup
>
import type {UTable} from "#components";
import {useClipboard, useDebounceFn} from '@vueuse/core'
import Filters from "~/components/animals/filters.vue";
import DefaultPagination from "~/components/ui/default-pagination.vue";
import type {Pagination} from "~/types/PaginationInterface";
import Dropdown from "~/components/ui/listagem/dropdown.vue";
import Confirm from "~/components/ui/dialogs/confirm.vue";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";

const store = useAnimalStore();
const router = useRouter();

const loading = computed(() => store.loading.fetched || false);
const pagination = computed(() => store.animalsPagination);

const table = ref<InstanceType<typeof UTable> | null>(null);

const rowSelection = ref({});

const params = useUrlSearchParams('history');

const confirmDelete = ref(false);
const animalToDeleteId = ref<number | null>(null);
const animalToDeleteName = ref<string>('');

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
  {value: 'show', icon: 'fa-list', label: 'Ficha técnica'},
  {value: 'delete', icon: 'fa-trash', label: 'Excluir'},
]

const dispatchAction = (action: string, animal: AnimalFormInterface) => {
  switch (action) {
    case 'show':
      router.push(`/animals/${animal?.id}`)
      break
    case 'delete':
      animalToDeleteId.value = Number(animal.id)
      animalToDeleteName.value = animal.name || ''
      confirmDelete.value = true
      break
  }
}

const submitDelete = async () => {
  const id = animalToDeleteId.value;
  if (id)
    await store.destroyAnimal(id);
  animalToDeleteId.value = null;
  animalToDeleteName.value = '';
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