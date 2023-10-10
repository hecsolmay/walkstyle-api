import { z } from 'zod'

export const loginDTO = z.object({
  email: z.string(
    {
      required_error: 'El campo email no puede estar vacío.',
      invalid_type_error: 'El campo email debe ser un string.'
    }
  ).trim().email('El campo email debe ser un correo valido.').toLowerCase(),
  password: z.string({
    required_error: 'El campo password no puede estar vacío.',
    invalid_type_error: 'El campo password debe ser un string.'
  })
})

export function validateLogin (input: any) {
  return loginDTO.safeParse(input)
}

export const registerDTO = z.object({
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

export function validateRegister (input: any) {
  return registerDTO.safeParse(input)
}

export const refreshBodyDTO = z.object({
  refreshToken: z.string({
    required_error: 'El campo refreshToken no puede estar vacío.',
    invalid_type_error: 'El campo refreshToken debe ser un string.'
  })
})

export function parseRefreshToken (input: any) {
  return refreshBodyDTO.safeParse(input)
}
