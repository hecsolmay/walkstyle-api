import { z } from 'zod'

export const productSchema = z.object({
  name: z.string({
    invalid_type_error: 'Se esperaba un nombre en el producto',
    required_error: 'Se esperaba un nombre en el producto'
  }).trim().toUpperCase().min(1, { message: 'Se esperaba un nombre en el producto' }),
  price: z.number({
    invalid_type_error: 'Se esperaba un numero para el precio',
    required_error: 'Se esperaba un numero para el precio'
  }).gte(0, { message: 'Se esperaba un numero positivo' }),
  size: z.number({
    invalid_type_error: 'Se esperaba un numero para la talla',
    required_error: 'Se esperaba un numero para la talla'
  }).gte(0, { message: 'Se esperaba un numero positivo' }),
  stock: z.number({
    invalid_type_error: 'Se esperaba un numero para el stock',
    required_error: 'Se esperaba un numero para el stock'
  }).gte(0, { message: 'Se esperaba un numero positivo' }),
  extraPrice: z.number({
    invalid_type_error: 'Se esperaba un numero para el precio extra',
    required_error: 'Se esperaba un numero para el precio extra'
  }).gte(0, { message: 'Se esperaba un numero positivo' }).optional().default(0),
  details: z.string({
    invalid_type_error: 'Se esperaba un detalle en el producto',
    required_error: 'Se esperaba un detalle en el producto'
  }).trim().toLowerCase().optional().default(''),
  genderId: z.string({
    invalid_type_error: 'Se esperaba un genero en el producto',
    required_error: 'Se esperaba un genero en el producto'
  }).uuid({ message: 'Se esperaba un genero valido en el producto' }),
  brandId: z.string({
    invalid_type_error: 'Se esperaba una marca en el producto',
    required_error: 'Se esperaba una marca en el producto'
  }).uuid({ message: 'Se esperaba una marca valida en el producto' }),
  categories: z.array(z.string({
    invalid_type_error: 'Se esperaba una categoria valida en el producto',
    required_error: 'Se esperaba una categoria valida en el producto'
  }).uuid({ message: 'Se esperaba una categoria valida en el producto' })).optional().default([])
})

export function validateProduct (input: any) {
  return productSchema.safeParse(input)
}

export function partialProduct (input: any) {
  return productSchema.partial().safeParse(input)
}
