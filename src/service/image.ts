import Image from '@/models/Image'
import ProductImage from '@/models/Product-Image'
import { type ImageDTO, type ProductImageDTO } from '@/types/createDto'

export async function saveImage (input: ImageDTO) {
  const image = await Image.create(input)
  await image.save()
  return image
}

export async function saveImageProduct (input: ProductImageDTO) {
  const image = await ProductImage.create(input)
  await image.save()
  return image
}

export async function deletedImagesProduct (productId?: string) {
  const deletedCount = await ProductImage.destroy({ where: { productId } })
  return deletedCount
}
