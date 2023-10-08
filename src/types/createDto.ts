import { type ROLE } from '@/constanst/enums'
import { type RegisterDTO } from '@/types/schemas'

export interface UserCreateDTO extends RegisterDTO {
  role?: ROLE
}

export interface ImageDTO {
  main: string
  thumbnail: string
  preview: string
}
