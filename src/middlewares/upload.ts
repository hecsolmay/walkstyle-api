import { FILE_SIZE_NUMBER, MAX_FILE_SIZE } from '@/constanst'
import { METHODS } from '@/constanst/enums'
import { MulterValidationError } from '@/utils/errors'
import { upload } from '@/utils/multer'
import { type NextFunction, type Request, type Response } from 'express'
import { MulterError } from 'multer'

export function handleOneFile (req: Request, res: Response, next: NextFunction) {
  const uploaded = upload.single('image')

  const method = req.method

  uploaded(req, res, function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    if (req.file === undefined && method === METHODS.POST) {
      return res.status(400).json({ message: 'Error al menos un archivo es necesario' })
    }

    const fileSize = req.file?.size ?? 0

    if (fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({ message: `Error en tamaño del archivo, el tamaño maximo es de ${FILE_SIZE_NUMBER}MB` })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}

export function handleMultipleFiles (req: Request, res: Response, next: NextFunction) {
  const uploaded = upload.array('images', 4)

  const method = req.method

  uploaded(req, res, function (err) {
    if (err instanceof MulterError || err instanceof MulterValidationError) {
      return res.status(400).json({ message: 'Error al subir los archivos', error: err.message })
    }

    const files = req.files as Express.Multer.File[] | undefined

    if ((files === undefined || files?.length === 0) && method === METHODS.POST) {
      return res.status(400).json({ message: 'Error al menos un archivo es necesario' })
    }

    const isCorrectSize = files?.every(file => file.size <= MAX_FILE_SIZE) ?? true

    if (!isCorrectSize) {
      return res.status(400).json({ message: `Error en tamaño del archivo, el tamaño maximo es de ${FILE_SIZE_NUMBER}MB` })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}

export function handleBannerAndImage (req: Request, res: Response, next: NextFunction) {
  const method = req.method

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

    const sizeBanner = banner?.size ?? 0
    const sizeImage = image?.size ?? 0

    if ((banner === undefined || image === undefined) && method === METHODS.POST) {
      return res.status(400).json({ message: 'Error es necesario un banner y una imagen' })
    }

    if (sizeBanner > MAX_FILE_SIZE || sizeImage > MAX_FILE_SIZE) {
      return res.status(400).json({ message: `Error en tamaño del archivo, el tamaño maximo es de ${FILE_SIZE_NUMBER}MB` })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  })
}
