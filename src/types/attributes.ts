export interface TimeStamps {
  createdAt?: Date
  updatedAt?: Date
}

export interface Role {
  typeId?: string
  name: string
}

export interface UserAttributes extends TimeStamps {
  userId?: string
  name: string
  lastname: string
  fullname: string | null
  email: string
  password?: string
  rememberToken: string | null
  // rol?: Role
}
