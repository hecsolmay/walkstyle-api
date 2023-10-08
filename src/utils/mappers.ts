import { ROLE, STATUS } from '@/constanst/enums'
import { type UserAttributes } from '@/types/attributes'

export function mapUserAttributes (user: UserAttributes, timeStamps = false) {
  const { role, roleId, password, createdAt, updatedAt, deletedAt, ...rest } = user

  if (timeStamps) {
    const status = deletedAt != null ? STATUS.INACTIVE : STATUS.ACTIVE

    return {
      ...rest,
      status,
      role: role?.name ?? ROLE.USER,
      createdAt,
      updatedAt
    }
  }

  return {
    ...rest,
    role: role?.name
  }
}
