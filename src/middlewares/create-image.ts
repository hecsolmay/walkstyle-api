import { PREVIEW_PARAMS, THUMBNAIL_PARAMS } from '@/constanst'
import { saveImage } from '@/service/image'
import { transformCloudinaryUrl, uploadImageToCloudinary } from '@/utils/cloudinary'
import { type NextFunction, type Request, type Response } from 'express'

async function uploadImageToCloudinaryAndSaveToDB (
  imageBuffer: Buffer,
  path: string
) {
  const result = await uploadImageToCloudinary(imageBuffer, { path })

  const imageObject = {
    main: result.secure_url,
    thumbnail: transformCloudinaryUrl(result.url, THUMBNAIL_PARAMS),
    preview: transformCloudinaryUrl(result.url, PREVIEW_PARAMS)
  }

  return await saveImage(imageObject)
}

export async function uploadOneImage (req: Request, res: Response, next: NextFunction) {
  try {
    const imageFile = req.file
    if (imageFile === undefined) {
      next()
      return
    }

    const imageBuffer = imageFile.buffer
    const image = await uploadImageToCloudinaryAndSaveToDB(imageBuffer, '/products')

    req.body.image = image.toJSON()
    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al subir la imagen' })
  }
}
export async function uploadBannerAndImage (req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined

    if (files?.banner === undefined || files?.image === undefined) {
      next()
      return
    }

    const bannerFile = files.banner[0]
    const imageFile = files.image[0]

    const imageBuffer = imageFile.buffer
    const bannerBuffer = bannerFile.buffer

    const [image, banner] = await Promise.all([
      uploadImageToCloudinaryAndSaveToDB(imageBuffer, '/images'),
      uploadImageToCloudinaryAndSaveToDB(bannerBuffer, '/banners')
    ])

    req.body.image = image.toJSON()
    req.body.banner = banner.toJSON()
    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al subir la imagen' })
  }
}

export async function uploadMultipleImages (req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[] | undefined

    if (files === undefined) {
      next()
      return
    }

    const uploadFiles = files.map(async file => await uploadImageToCloudinaryAndSaveToDB(file.buffer, '/products'))
    const images = await Promise.all(uploadFiles)
    req.body.images = images

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al subir la imagen' })
  }
}
