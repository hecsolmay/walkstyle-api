import { VALID_IMAGE_EXTENSION } from '@/constanst'
import multer from 'multer'
import path from 'node:path'
import { MulterValidationError } from './errors'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  fileFilter: function (_req, file, cb) {
    const fileExtension = path.extname(file.originalname)

    if (!VALID_IMAGE_EXTENSION.includes(fileExtension)) {
      const errorMessage = `Error en extencion del archivo, las extensiones validas son ${VALID_IMAGE_EXTENSION.join(', ')}`
      cb(new MulterValidationError(errorMessage))
      return
    }

    cb(null, true)
  }
})
