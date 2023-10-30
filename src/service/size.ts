import Product from '@/models/Product'
import Size from '@/models/Size'
import { type SizeCreateDTO } from '@/types/createDto'
import { Op } from 'sequelize'

export async function CreateSize (newSize: SizeCreateDTO) {
  const size = await Size.create(newSize)
  await size.save()
  return size
}

export async function GetProductSizes (productId?: string, getDeleted = false) {
  const sizes = await Size.findAll({
    order: [
      ['size', 'ASC']
    ],
    where: {
      productId
    },
    paranoid: !getDeleted
  })

  return sizes
}

interface SearchSize {
  productId: string
  size: number
  getDeleted?: boolean
}

export async function GetOneSize (search: SearchSize) {
  const deleted = Boolean(search.getDeleted)

  const size = await Size.findOne({
    where: {
      [Op.and]: [
        { productId: search.productId },
        { size: search.size }
      ]
    },
    paranoid: !deleted
  })

  return size
}

export async function GetById (sizeId?: string, getDeleted = false) {
  const deleted = Boolean(getDeleted)
  const size = await Size.findByPk(sizeId, {
    include: [
      { model: Product }
    ],
    paranoid: !deleted
  })
  return size
}

interface UpdateParams {
  sizeId?: string
  updateSize: Partial<SizeCreateDTO>
}

export async function UpdateById ({ sizeId, updateSize }: UpdateParams) {
  const [affectedNumber] = await Size.update(updateSize, {
    where: {
      sizeId
    }
  })

  return affectedNumber
}

export async function DeleteById (sizeId?: string) {
  const deletedCount = await Size.destroy({
    where: {
      sizeId
    }
  })

  return deletedCount
}

export async function RestoreById (sizeId?: string) {
  const restoredSize = await Size.findByPk(sizeId, {
    paranoid: false
  })

  if (restoredSize === null) {
    return null
  }

  await restoredSize.restore()
  return restoredSize
}
