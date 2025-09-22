export interface AnimalFormInterface {
  identifier: string | null,
  name: string | null,
  sex: boolean | null,
  born_date: string | null,
  image: string | null,
  breed_id: number | string | null,
  classification_id: number | string | null,
  status_id: number | string | null,
  father_id: number | string | null,
  mother_id: number | string | null,
  farm_id: number | string | null,
}