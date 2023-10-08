import { validateCategory } from '@/schemas/category'
import { Create } from '@/service/category'
import { type Request, type Response } from 'express'

export async function createCategory (req: Request, res: Response) {
  try {
    console.log({ files: req.files })
    const result = validateCategory(req.body)

    if (!result.success) {
      return res.status(400).json({ message: 'Bad Request', errors: result.error })
    }

    const categoryCreated = await Create(result.data)

    return res.status(201).json({ message: 'Category created', category: categoryCreated.toJSON() })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al crear la categoría' })
  }
}
