import Image from '@/models/Image'
import { type ImageDTO } from '@/types/createDto'

export async function saveImage (input: ImageDTO) {
  const image = await Image.create(input)
  await image.save()
  return image
}
