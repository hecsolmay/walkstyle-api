import { z } from 'zod'

export const sizeSaleSchema = z.object({
  sizeId: z.string({
    invalid_type_error: 'sizeId must be a string',
    required_error: 'sizeId is required'
  }).uuid(),
  quantity: z.number({
    invalid_type_error: 'quantity must be a number',
    required_error: 'quantity is required'
  }).default(1)
})

export const saleSchema = z.object({
  userId: z.string({
    invalid_type_error: 'userId must be a string',
    required_error: 'a user is required'
  }).uuid(),
  products: z.array(sizeSaleSchema)
}).refine((data) => {
  return data.products.length > 0
}, {
  message: 'Must have at least one product'
})

export function validateSale (input: any) {
  return saleSchema.safeParse(input)
}
