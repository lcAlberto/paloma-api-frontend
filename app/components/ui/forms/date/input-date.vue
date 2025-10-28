<template>
  <div :class="['form-control w-full', { 'opacity-50 pointer-events-none': loading }]">
    <label
        v-if="label"
        class="label"
    >
      <span class="label-text">{{ label }}
        <span
            v-if="isRequired"
            class="text-error font-bold"
        >*</span>
      </span>
    </label>

    <div
        :class="[
        'input input-bordered w-full flex items-center justify-between cursor-pointer',
        { 'input-error': errorMessage },
        { 'loading': loading }
      ]"
        tabindex="0"
        @click="toggleCalendar"
        @keydown.enter="toggleCalendar"
    >
      <span
          v-if="!displayValue"
          class="text-gray-400"
      >Selecione uma data...</span>
      <span v-else>{{ displayValue }}</span>
      <i
          :class="{ 'rotate-180': isCalendarOpen }"
          class="fa fa-chevron-down transition-transform duration-300"
      />
    </div>

    <label
        v-if="errorMessage"
        class="label"
    >
      <span class="label-text-alt text-error">{{ errorMessage }}</span>
    </label>

    <div
        v-if="isCalendarOpen"
        class="dropdown-content mt-2 p-4 shadow-2xl bg-base-100 rounded-box w-full xl:max-w-sm lg:max-w-sm z-10 border border-base-300"
    >
      <div class="flex justify-between items-center mb-4">
        <button
            class="btn btn-sm btn-ghost"
            @click="prevMonths"
        >
          <i class="fa fa-chevron-left"/>
        </button>
        <div class="text-lg font-semibold text-center">
          {{ formatMonthYear(currentMonth) }}
        </div>
        <button
            class="btn btn-sm btn-ghost"
            @click="nextMonths"
        >
          <i class="fa fa-chevron-right"/>
        </button>
      </div>

      <div
          :style="{ gridTemplateColumns: `repeat(${numberOfMonthsToShow}, 1fr)` }"
          class="grid gap-5"
      >
        <div
            v-for="(month, index) in monthsToRender"
            :key="index"
            class="calendar-container"
        >
          <h4 class="text-center mb-2">{{ formatMonthYear(month) }}</h4>
          <div class="grid grid-cols-7 justify-items-stretch justify-center items-center gap-0 text-xs font-semibold text-center mb-1">
            <span
                v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
                :key="day"
                class="font-light"
            >{{ day }}</span>
          </div>
          <div class="grid grid-cols-7 justify-items-stretch gap-0">
            <span
                v-for="n in startDayOfWeek(month)"
                :key="`empty-${index}-${n}`"
            />

            <button
                v-for="day in daysInMonth(month)"
                :key="`day-${index}-${day}`"
                :class="dayClasses(month.getFullYear(), month.getMonth(), day)"
                :disabled="isDayDisabled(month.getFullYear(), month.getMonth(), day)"
                @click="selectDay(month.getFullYear(), month.getMonth(), day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script
    lang="ts"
    setup
>
import {ref, computed, onMounted} from 'vue';

const props = defineProps({
  // MUDANÇA: modelValue agora é Date ou String (data única), ou null
  modelValue: {
    type: [Date, String],
    default: null
  },
  label: {type: String, default: ''},
  errorMessage: {type: String, default: ''},
  isRequired: {type: Boolean, default: false},
  loading: {type: Boolean, default: false},
  minDate: {type: [String, Date], default: null},
  maxDate: {type: [String, Date], default: null},
  // MUDANÇA: Padrão para 1 mês, já que é seleção simples
  numberOfMonthsToShow: {type: Number, default: 1, validator: (val) => val >= 1 && val <= 4}
});

const emit = defineEmits(['update:modelValue']);

const isCalendarOpen = ref(false);
const currentMonth = ref(new Date());

const minDateObj = computed(() => props.minDate ? (props.minDate instanceof Date ? props.minDate : new Date(props.minDate)) : null);
const maxDateObj = computed(() => props.maxDate ? (props.maxDate instanceof Date ? props.maxDate : new Date(props.maxDate)) : null);

// futureMonth e monthsToRender podem ser mantidos, mas futureMonth será útil apenas se numberOfMonthsToShow > 1

const monthsToRender = computed(() => {
  const months = [];
  for (let i = 0; i < props.numberOfMonthsToShow; i++) {
    const date = new Date(currentMonth.value);
    date.setMonth(date.getMonth() + i);
    months.push(date);
  }
  return months;
});

// MUDANÇA: displayValue exibe apenas a data selecionada
const displayValue = computed(() => {
  return props.modelValue ? formatDate(props.modelValue) : null;
});

function toggleCalendar() {
  isCalendarOpen.value = !isCalendarOpen.value;
  // MUDANÇA: Centraliza no mês da data selecionada
  if (isCalendarOpen.value && props.modelValue) {
    currentMonth.value = new Date(props.modelValue);
    currentMonth.value.setDate(1);
  } else if (isCalendarOpen.value) {
    currentMonth.value = new Date();
    currentMonth.value.setDate(1);
  }
}

function prevMonths() {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() - props.numberOfMonthsToShow));
}

function nextMonths() {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() + props.numberOfMonthsToShow));
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function startDayOfWeek(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatMonthYear(date: Date) {
  console.log(date)
  if (!date) return '';
  const options = {year: 'numeric', month: 'long'};
  return date.toLocaleDateString('pt-BR', options);
}

function normalizeDate(year: number | string, month: number | string, day: number | string) {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function selectDay(year: number | string, month: number | string, day: number | string) {
  const selectedDate = normalizeDate(year, month, day);
  const currentNormalized = props.modelValue ? normalizeDate(new Date(props.modelValue).getFullYear(), new Date(props.modelValue).getMonth(), new Date(props.modelValue).getDate()) : null;

  if (currentNormalized && selectedDate.getTime() === currentNormalized.getTime()) {
    emit('update:modelValue', null);
  } else {
    emit('update:modelValue', selectedDate);
  }
  isCalendarOpen.value = false;
}


function isDayDisabled(year: number | string, month: number | string, day: number | string) {
  const date = normalizeDate(year, month, day);

  if (minDateObj.value && date.getTime() < normalizeDate(minDateObj.value.getFullYear(), minDateObj.value.getMonth(), minDateObj.value.getDate()).getTime()) {
    return true;
  }

  if (maxDateObj.value) {
    const maxDateNormalized = normalizeDate(maxDateObj.value.getFullYear(), maxDateObj.value.getMonth(), maxDateObj.value.getDate());
    if (date.getTime() > maxDateNormalized.getTime()) {
      return true;
    }
  }

  return false;
}

function dayClasses(year: number | string, month: number | string, day: number | string) {
  const date = normalizeDate(year, month, day);
  let classes = ['btn btn-sm btn-ghost p-0 h-8 w-8 text-center text-sm rounded-box'];

  const today = normalizeDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const selectedDate = props.modelValue ? normalizeDate(new Date(props.modelValue).getFullYear(), new Date(props.modelValue).getMonth(), new Date(props.modelValue).getDate()) : null;


  if (date.getTime() === today.getTime()) {
    classes.push('btn-info font-bold');
  }

  if (isDayDisabled(year, month, day)) {
    classes = ['btn btn-sm btn-ghost p-0 h-8 w-8 text-center text-sm rounded-box', 'line-through text-gray-400 cursor-not-allowed'];
    return classes.join(' ');
  }
  if (selectedDate && date.getTime() === selectedDate.getTime()) {
    classes = classes.filter(c => !c.includes('btn-info'));
    classes.push('btn-primary');
  }

  return classes.join(' ');
}


onMounted(() => {
  if (props.modelValue) {
    currentMonth.value = new Date(props.modelValue);
  } else {
    currentMonth.value = new Date();
  }
  currentMonth.value.setDate(1);
});
</script>

<style scoped>
.dropdown-content {
  position: absolute;
  z-index: 100;
}
</style>