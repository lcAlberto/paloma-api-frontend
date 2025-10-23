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
      >Selecione um período...</span>
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
        class="dropdown-content mt-2 p-4 shadow-2xl bg-base-100 rounded-box w-full xl:max-w-lg lg:max-w-xl z-10 border border-base-300"
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
          <span v-if="numberOfMonthsToShow > 1"> - {{ formatMonthYear(futureMonth) }}</span>
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
          @mouseleave="clearHover"
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
                @mouseenter="setHover(month.getFullYear(), month.getMonth(), day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({start: null, end: null}),
    validator: (val) => val && ('start' in val) && ('end' in val)
  },
  label: {type: String, default: ''},
  errorMessage: {type: String, default: ''},
  isRequired: {type: Boolean, default: false},
  loading: {type: Boolean, default: false},
  minDate: {type: [String, Date], default: null},
  maxDate: {type: [String, Date], default: null},
  numberOfMonthsToShow: {type: Number, default: 2, validator: (val) => val >= 1 && val <= 4}
});

const emit = defineEmits(['update:modelValue']);

const isCalendarOpen = ref(false);
const currentMonth = ref(new Date());
const hoverDate = ref(null);

const minDateObj = computed(() => props.minDate ? (props.minDate instanceof Date ? props.minDate : new Date(props.minDate)) : null);
const maxDateObj = computed(() => props.maxDate ? (props.maxDate instanceof Date ? props.maxDate : new Date(props.maxDate)) : null);

const futureMonth = computed(() => {
  const date = new Date(currentMonth.value);
  date.setMonth(date.getMonth() + props.numberOfMonthsToShow - 1);
  return date;
});

const monthsToRender = computed(() => {
  const months = [];
  for (let i = 0; i < props.numberOfMonthsToShow; i++) {
    const date = new Date(currentMonth.value);
    date.setMonth(date.getMonth() + i);
    months.push(date);
  }
  return months;
});

const displayValue = computed(() => {
  if (props.modelValue.start && props.modelValue.end) {
    const startStr = formatDate(props.modelValue.start);
    const endStr = formatDate(props.modelValue.end);
    return `${startStr} - ${endStr}`;
  }
  if (props.modelValue.start) {
    return `${formatDate(props.modelValue.start)} - ...`;
  }
  return null;
});

function toggleCalendar() {
  isCalendarOpen.value = !isCalendarOpen.value;
  if (isCalendarOpen.value && props.modelValue.start) {
    currentMonth.value = new Date(props.modelValue.start);
    currentMonth.value.setDate(1);
  } else if (isCalendarOpen.value) {
    currentMonth.value = new Date();
    currentMonth.value.setDate(1);
  }
  clearHover();
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

function formatMonthYear(date) {
  if (!date) return '';
  const options = {year: 'numeric', month: 'long'};
  return date.toLocaleDateString('pt-BR', options);
}

function normalizeDate(year, month, day) {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function setHover(year, month, day) {
  if (props.modelValue.start && !props.modelValue.end) {
    const date = normalizeDate(year, month, day);
    if (!isDayDisabled(year, month, day)) {
      hoverDate.value = date;
    }
  }
}

function clearHover() {
  hoverDate.value = null;
}

function selectDay(year, month, day) {
  const selectedDate = normalizeDate(year, month, day);

  let newStart = props.modelValue.start ? normalizeDate(props.modelValue.start.getFullYear(), props.modelValue.start.getMonth(), props.modelValue.start.getDate()) : null;
  let newEnd = props.modelValue.end ? normalizeDate(props.modelValue.end.getFullYear(), props.modelValue.end.getMonth(), props.modelValue.end.getDate()) : null;

  if (!newStart || (newStart && newEnd)) {
    newStart = selectedDate;
    newEnd = null;
  } else if (newStart && !newEnd) {
    if (selectedDate.getTime() < newStart.getTime()) {
      newEnd = newStart;
      newStart = selectedDate;
    } else {
      newEnd = selectedDate;
    }
  }

  console.log({start: newStart, end: newEnd})

  emit('update:modelValue', {start: newStart, end: newEnd});
  clearHover();
}


function isDayDisabled(year, month, day) {
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

function dayClasses(year, month, day) {
  const date = normalizeDate(year, month, day);
  let classes = ['btn btn-sm btn-ghost p-0 h-8 w-8 text-center text-sm rounded-box'];

  const today = normalizeDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const start = props.modelValue.start ? normalizeDate(props.modelValue.start.getFullYear(), props.modelValue.start.getMonth(), props.modelValue.start.getDate()) : null;
  const end = props.modelValue.end ? normalizeDate(props.modelValue.end.getFullYear(), props.modelValue.end.getMonth(), props.modelValue.end.getDate()) : null;
  const hover = hoverDate.value;

  if (date.getTime() === today.getTime()) {
    classes.push('btn-info font-bold');
  }

  if (isDayDisabled(year, month, day)) {
    classes = ['btn btn-sm btn-ghost p-0 h-8 w-8 text-center text-sm rounded-box', 'line-through text-gray-400 cursor-not-allowed'];
    return classes.join(' ');
  }

  if (start && !end && hover) {
    const isBetweenStartAndHover = false;
    let startRange = start;
    let endRange = hover;

    if (startRange.getTime() > endRange.getTime()) {
      [startRange, endRange] = [endRange, startRange];
    }

    if (date.getTime() > startRange.getTime() && date.getTime() < endRange.getTime()) {
      classes.push('bg-primary/20 hover:bg-primary/30 rounded-none');
    }

    if (date.getTime() === startRange.getTime() && date.getTime() !== start.getTime()) {
      classes.push('bg-primary/50 rounded-r-none');
    }
    if (date.getTime() === endRange.getTime() && date.getTime() !== start.getTime()) {
      classes.push('bg-primary/50 rounded-l-none');
    }
  }

  if (start && end && date.getTime() > start.getTime() && date.getTime() < end.getTime()) {
    classes.push('bg-primary/20 hover:bg-primary/30 rounded-none');
  }

  if (start && date.getTime() === start.getTime()) {
    classes = classes.filter(c => !c.includes('rounded-none') && !c.includes('bg-primary/')); // Limpa estilos de range/hover
    classes.push('btn-primary rounded-box', end ? 'rounded-r-none' : 'rounded-box');
  }

  if (end && date.getTime() === end.getTime()) {
    classes = classes.filter(c => !c.includes('rounded-none') && !c.includes('bg-primary/')); // Limpa estilos de range/hover
    classes.push('btn-primary rounded-box rounded-l-none');
  }

  if (start && !end && hover) {
    let startRange = start;
    let endRange = hover;
    if (startRange.getTime() > endRange.getTime()) {
      [startRange, endRange] = [endRange, startRange];
    }

    if (date.getTime() === startRange.getTime() && date.getTime() !== start.getTime()) {
      classes.push('rounded-r-none');
    }
    if (date.getTime() === endRange.getTime() && date.getTime() !== start.getTime()) {
      classes.push('rounded-l-none');
    }
  }
  return classes.join(' ');
}


onMounted(() => {
  if (props.modelValue.start) {
    currentMonth.value = new Date(props.modelValue.start);
  } else {
    currentMonth.value = new Date();
  }
  currentMonth.value.setDate(1);
});
</script>

<style scoped>
/* DaisyUI já cuida da maioria, mas ajustamos o posicionamento do dropdown */
.dropdown-content {
  position: absolute;
  /* Garante que o calendário fique acima de outros elementos */
  z-index: 100;
}

/* Estilo para garantir que o contêiner do calendário ajuste o layout */
.calendar-container {
}
</style>