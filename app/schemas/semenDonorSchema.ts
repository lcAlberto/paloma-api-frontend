// schemas/semenDonorSchema.ts
import {z} from 'zod';

/**
 * Esquema Zod para validação do formulário de Doador de Sêmen.
 * Baseado na class SemenDonor do modelo Django.
 */
export const SemenDonorSchema = z.object({
  name: z.string()
    .min(1, {message: 'O nome é obrigatório.'})
    .max(100, {message: 'O nome deve ter no máximo 100 caracteres.'}),

  registration_number: z.string()
    .max(100, {message: 'O registro deve ter no máximo 100 caracteres.'})
    .nullable()
    .optional()
    .transform(e => (e === "" ? null : e)),

  breed_id: z.number()
    .max(100, {message: 'O registro deve ter no máximo 100 caracteres.'})
    .nullable()
    .optional()
    .transform(e => (e === 0 ? null : e)),

  born_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'A data de nascimento deve estar no formato AAAA-MM-DD.'})
    .nullable()
    .optional()
    .transform(e => (e === "" ? null : e)),

  origin_farm_name: z.string()
    .max(150, {message: 'A fazenda de origem deve ter no máximo 150 caracteres.'})
    .optional()
    .transform(e => (e === "" ? undefined : e)),

  collection_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'A data de coleta deve estar no formato AAAA-MM-DD.'})
    .nullable()
    .optional()
    .transform(e => (e === "" ? null : e)),
});

export type SemenDonorForm = z.infer<typeof SemenDonorSchema>;