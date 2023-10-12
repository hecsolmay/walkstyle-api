import { DEFAULT_PAGINATION_WITH_SEARCH } from '@/constanst'
import Category from '@/models/Category'
import Image from '@/models/Image'
import { type QueryWithDeleted } from '@/types/queries'
import { type CategoryDTO } from '@/types/schemas'
import { Op } from 'sequelize'

export async function GetAll ({
  limit = 10,
  offset = 0,
  q = '',
  getDeleted
}: QueryWithDeleted = DEFAULT_PAGINATION_WITH_SEARCH) {
  const deleted = Boolean(getDeleted)

  const { count, rows: categories } = await Category.findAndCountAll({
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
  return { categories, count }
}

export async function GetById (id?: string) {
  const category = await Category.findByPk(id, {
    include: [
      { model: Image, as: 'image' },
      { model: Image, as: 'banner' }
    ]
  })
  return category
}

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

export async function DeleteById (id: string) {
  const deletedCount = await Category.destroy({
    where: {
      categoryId: id
    }
  })

  return deletedCount
}

export async function RestoreById (id: string) {
  const category = await Category.findByPk(id, {
    include: [
      { model: Image, as: 'image' },
      { model: Image, as: 'banner' }
    ],
    paranoid: false
  })

  console.log({ category })

  if (category === null) {
    return null
  }

  await category.restore()

  return category
}
