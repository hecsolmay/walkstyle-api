import { MulterValidationError } from '@/utils/errors'
import { upload } from '@/utils/multer'
import { type NextFunction, type Request, type Response } from 'express'
import { MulterError } from 'multer'

export function uploadOneFile (req: Request, res: Response, next: NextFunction) {
  const uploaded = upload.single('image')

  uploaded(req, res, function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    if (req.file === undefined) {
      return res.status(400).json({ message: 'Error al menos un archivo es necesario' })
    }

    const fileSize = req.file.size ?? 0

    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Error en tamaño del archivo, el tamaño maximo es de 5MB' })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}

export function uploadMultipleFiles (req: Request, res: Response, next: NextFunction) {
  const uploaded = upload.array('images', 4)

  uploaded(req, res, function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}

export function uploadBannerAndImage (req: Request, res: Response, next: NextFunction) {
  const uploaded = upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ])

  uploaded(req, res, function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    const files = req.files as Record<string, Express.Multer.File[]> | undefined
    const banner = files?.banner?.[0]
    const image = files?.image?.[0]

    if (banner === undefined || image === undefined) {
      return res.status(400).json({ message: 'Error es necesario un banner y una imagen' })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}
