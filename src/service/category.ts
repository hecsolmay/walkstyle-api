import Category from '@/models/Category'
import { type CategoryDTO } from '@/types/schemas'

export async function Create (input: CategoryDTO) {
  const { banner, image, name } = input
  const category = await Category.create({
    name,
    imageId: image.imageId,
    bannerId: banner.imageId
  })

  await category.save()
  return category
}
