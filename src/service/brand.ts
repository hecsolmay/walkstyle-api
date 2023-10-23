import { DEFAULT_PAGINATION_WITH_SEARCH } from '@/constanst'

import Brand from '@/models/Brand'
import Image from '@/models/Image'
import { type QueryWithDeleted } from '@/types/queries'
import { type BrandDTO } from '@/types/schemas'
import { Op } from 'sequelize'

export async function GetAll ({
  limit = 10,
  offset = 0,
  q = '',
  getDeleted
}: QueryWithDeleted = DEFAULT_PAGINATION_WITH_SEARCH) {
  const deleted = Boolean(getDeleted)

  const { count, rows: brand } = await Brand.findAndCountAll({
    include: [
      { model: Image, as: 'image' },
      { model: Image, as: 'banner' }
    ],
    offset,
    limit,
    where: {
      name: {
        [Op.like]: `%${q}%`
      }
    },
    paranoid: !deleted
  })
  return { brand, count }
}

export async function GetById (id?: string) {
  const brand = await Brand.findByPk(id, {
    include: [
      { model: Image, as: 'image' },
      { model: Image, as: 'banner' }
    ]
  })
  return brand
}
export async function Create (input: BrandDTO) {
  const { banner, image, name } = input
  const brand = await Brand.create({
    name,
    imageId: image.imageId,
    bannerId: banner.imageId
  })

  await brand.save()
  return brand
}

interface UpdateBrand {
  brandId?: string
  newBanner?: Partial<BrandDTO>
}

export async function UpdateById ({ brandId, newBanner }: UpdateBrand) {
  const imageId = newBanner?.image?.imageId
  const bannerId = newBanner?.banner?.imageId

  const updateBanner = {
    name: newBanner?.name,
    bannerId,
    imageId
  }

  const [updatedCount] = await Brand.update(updateBanner, {
    where: {
      brandId
    }
  })

  return updatedCount
}

export async function DeleteById (id: string) {
  const deletedCount = await Brand.destroy({
    where: {
      brandId: id
    }
  })

  return deletedCount
}

export async function RestoreById (id: string) {
  const brand = await Brand.findByPk(id, {
    include: [
      { model: Image, as: 'image' },
      { model: Image, as: 'banner' }
    ],
    paranoid: false
  })

  if (brand === null) {
    return null
  }

  await brand.restore()

  return brand
}
