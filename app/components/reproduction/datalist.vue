<template>
  <div class="flex flex-col w-full max-h-[70vh] overflow-y-auto">
    <div class="">
      <filters/>
    </div>
    <UTable
        ref="table"
        v-model:row-selection="rowSelection"
        :columns="columns"
        :data="store.reproductions"
        :loading="store.loading.fetchingReproductions"
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
              :options="[
                  {value: 'show', icon: 'fa-list', label: 'Ficha técnica'},
                  {value: 'delete', icon: 'fa-trash', label: 'Excluir'},
              ]"
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
  </div>
</template>
<script
    lang="ts"
    setup
>

import DefaultPagination from "~/components/ui/default-pagination.vue";
import Dropdown from "~/components/ui/listagem/dropdown.vue";
import type {AnimalFormInterface} from "~/types/AnimalFormInterface";
import {useReproductionStore} from "~/stores/reproductionStore";
import Filters from "~/components/reproduction/filters.vue";

const params = useUrlSearchParams('history');
const router = useRouter();
const store = useReproductionStore();

const rowSelection = ref({});
const pagination = computed(() => store.pagination);

const handlePageUpdate = (page: number) => {
  params.page = String(page);
};

const dispatchAction = (action: string, animal: AnimalFormInterface) => {
  if (action === 'show')
    router.push(`/reproduction/${animal?.id}`)
}

watch(params, async (newParams) => {
  const query = Object.fromEntries(
      Object.entries(newParams).filter(([key, value]) => value !== null && value !== undefined && value !== '')
  );

  await store.fetchReproductions(query);
}, {immediate: true, deep: true});

const columns = [
  {
    accessorKey: 'female_animal_id',
    header: 'Fêmea',
    cell: ({row}) => {
      const female = row.original.female_animal;
      if (!female || !female.id) return 'N/A';
      return h('a', {
            href: `/animals/${female.id}`,
            class: 'text-primary hover:underline'
          },
          female.name
      )
    }
  },
  {
    accessorKey: 'mating_date',
    header: 'Data da Cobertura',
    cell: ({row}) => {
      const date = row.getValue('mating_date');
      return date ? new Date(date).toLocaleDateString('pt-BR') : '';
    }
  },
  {
    accessorKey: 'mating_type',
    header: 'Tipo da Cobertura',
  },
  {
    accessorKey: 'male_animal_id',
    header: 'Macho',
    cell: ({row}) => {
      const male = row.original.male_animal;
      if (!male || !male.id) return 'N/A';
      return h('a', {
            href: `/animals/${male.id}`,
            class: 'text-primary hover:underline'
          },
          male.name
      )
    }
  },
  {
    accessorKey: 'predicted_calving_date',
    header: 'Parto Previsto',
    cell: ({row}) => {
      const date = row.getValue('predicted_calving_date');
      return date ? new Date(date).toLocaleDateString('pt-BR') : '-';
    }
  },

  {
    accessorKey: 'predicted_calving_date',
    header: 'Data de Nascimento',
    cell: ({row}) => {
      const date = row.getValue('predicted_calving_date');
      return date ? new Date(date).toLocaleDateString('pt-BR') : '-';
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
    accessorKey: 'calf_born',
    header: 'Macho',
    cell: ({row}) => {
      const calf = row.original.calf_born;
      if (!calf || !calf.id) return 'N/A';
      return h('a', {
            href: `/animals/${calf.id}`,
            class: 'text-primary hover:underline'
          },
          calf.name
      )
    }
  },
  {
    id: 'actions',
    header: 'Ações',
  },
];

onMounted(() => {
  // store.fetchReproductions();
});
</script>


<style scoped>

</style>