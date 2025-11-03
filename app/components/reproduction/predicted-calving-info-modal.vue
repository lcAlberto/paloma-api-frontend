<template>
  <div>
    <modal
        v-model="openModalReproductionInfo"
        width-class="w-7xl"
        @close="reproductionStore.clearReproductionCreateInfo()"
    >
      <template #header>
        <div>
          <div class="flex flex-col w-full gap-3">
            <div class="bg-secondary-content text-secondary w-min py-2 px-2 rounded-xl">
              <i class="fa-solid fa-calendar-alt fa-3x"/>
            </div>
            <div class="flex flex-col w-full">
              <h3 class="text-2xl font-bold">Previsão de parto</h3>
              <p>Ciclo reprodutivo iniciado</p>
            </div>
          </div>
        </div>
      </template>
      <template #body>
        <div>
          <p>A data do parto é uma estimativa. Diversos fatores como clima, raça do animal, e
            até mesmo as fases da lua podem influenciar no dia em que o parto acontecerá</p>
          <div
              v-if="reproductionCreateInfo"
              class="flex flex-col items-center justify-center"
          >
            <div class="w-full py-5">
              <h3 class="text-2xl font-bold">{{ reproductionCreateInfo?.female_animal?.name }}</h3>
            </div>
            <div class="stats shadow mt-5">
              <div class="stat place-items-center">
                <div class="stat-title text-lg">Tipo</div>
                <div class="stat-value">{{ reproductionCreateInfo.mating_type }}</div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title text-lg">Ciclo iniciado em</div>
                <div class="stat-value">
                  {{ new Date(reproductionCreateInfo.heat_start_date).toLocaleDateString() }}
                </div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title text-lg">Parto previsto para</div>
                <div class="stat-value text-secondary">
                  {{ new Date(reproductionCreateInfo.predicted_calving_date).toLocaleDateString() }}
                </div>
              </div>
            </div>

            <div class="overflow-x-auto mt-5">
              <h1 class="text-xl font-bold">
                Detalhes
              </h1>
              <table class="table w-full">
                <thead>
                <tr>
                  <th>Fêmea</th>
                  <th>Data da cobertura/fecundação</th>
                  <th>Tipo</th>
                  <th>
                    <span v-if="reproductionCreateInfo.mating_type === 'natural'">
                      Macho
                    </span>
                    <span v-else>
                      Doador
                    </span>
                  </th>
                </tr>
                </thead>
                <tbody v-if="reproductionCreateInfo">
                <tr>
                  <td>{{ reproductionCreateInfo?.female_animal?.name }}</td>
                  <td>
                    <span v-if="reproductionCreateInfo?.mating_date">
                      {{ new Date(reproductionCreateInfo?.mating_date).toLocaleDateString() }}
                    </span>
                  </td>
                  <td>{{ reproductionCreateInfo.mating_type }}</td>
                  <td>
                    <span v-if="reproductionCreateInfo.mating_type && reproductionCreateInfo.male_animal">
                      {{ reproductionCreateInfo.male_animal.name }}
                    </span>
                    <span v-else>
                      -
                    </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>
<script
    lang="ts"
    setup
>
import Modal from "~/components/ui/dialogs/modal.vue";

const reproductionStore = useReproductionStore();
const {openModalReproductionInfo, reproductionCreateInfo} = storeToRefs(reproductionStore)

</script>


<style scoped>

</style>