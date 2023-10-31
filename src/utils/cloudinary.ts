import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Opciones de transformación
const transformationOptions: UploadApiOptions = {
  width: 1000,
  height: 1000,
  crop: 'fill',
  format: 'png'
}

interface Props {
  options?: UploadApiOptions
  path?: string
}

const DEFAULT_FOLDER = process.env.NODE_ENV === 'production' ? 'walkstyle' : 'walkstyle-dev'

export function transformCloudinaryUrl (url: string, params: string): string {
  const parts = url.split('/upload/')

  if (parts.length === 2) {
    const transformedURL = `${parts[0]}/upload/${params}/${parts[1]}`
    return transformedURL
  }

  return ''
}

// Función para subir un buffer de imagen a Cloudinary y devuelve una promesa
export async function uploadImageToCloudinary (
  imageBuffer: Buffer, { options = transformationOptions, path = '' }: Props
): Promise<UploadApiResponse> {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        ...options,
        folder: `${DEFAULT_FOLDER}${path}`
      },
      (error, result) => {
        if (result !== undefined) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    )

    // Convierte el buffer en un flujo y lo envía al stream de carga de Cloudinary
    stream.end(imageBuffer)
  })
}
