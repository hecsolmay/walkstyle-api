import Size from '@/models/Size'
import { type SizeCreateDTO } from '@/types/createDto'

export async function CreateSize (newSize: SizeCreateDTO) {
  const size = await Size.create(newSize)
  await size.save()
  return size
}
