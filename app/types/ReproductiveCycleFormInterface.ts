export interface ReproductiveCycleFormInterface {
  id: number | string | null,
  heat_start_date: string | Date | null,
  mating_date: string | Date | null,
  mating_type: 'natural' | 'artificial' | null,
  predicted_calving_date: string | Date | null,
  actual_calving_date: string | Date | null,
  status: string | null,
  calf_born_id: number | string | null,
  female_animal_id: number | string | null,
  male_animal_id: number | string | null,
}