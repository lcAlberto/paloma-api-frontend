export interface ReproductiveCycleData {
  id: number | string | null,
  heat_start_date: string | Date | null,
  mating_date: string | Date | null,
  mating_type: 'natural' | 'artificial' | null,
  predicted_calving_date: string | Date | null,
  actual_calving_date: string | Date | null,
  status: string | null,
  female_animal: animal | null,
  male_animal: animal | null,
  calf_born: animal | null,
}

interface animal {
    id: number,
    name: string,
    identifier: string,
    sex: string,
}