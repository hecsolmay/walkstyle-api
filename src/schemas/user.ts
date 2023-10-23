import { z } from 'zod'

export const userDTO = z.object({
  name: z.string({
    required_error: 'El campo name no puede estar vacío.',
    invalid_type_error: 'El campo name debe ser un string.'
  }).trim().toLowerCase(),
  lastname: z.string({
    required_error: 'El campo lastname no puede estar vacío.',
    invalid_type_error: 'El campo lastname debe ser un string.'
  }).trim().toLowerCase().optional(),
  email: z.string(
    {
      required_error: 'El campo email no puede estar vacío.',
      invalid_type_error: 'El campo email debe ser un string.'
    }
  ).trim().email('El campo email debe ser un correo válido.')
    .toLowerCase(),
  password: z.string({
    required_error: 'El campo password no puede estar vacioso.',
    invalid_type_error: 'El campo password debe ser un string.'
  })
})

export function validateUser (input: any) {
  return userDTO.safeParse(input)
}

export function partialUser (input: any) {
  return userDTO.partial().safeParse(input)
}
