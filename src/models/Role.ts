import { ROLE as RoleEnum } from '@/constanst/enums'
import { sequelize } from '@/database'
import { type RoleModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const enumsRoles = Object.values(RoleEnum)

const Role: ModelStatic<RoleModel> = sequelize.define<RoleModel>('roles', {
  roleId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'role_id'
  },
  name: {
    type: DataTypes.ENUM(...enumsRoles),
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'Role',
  timestamps: true,
  paranoid: true
})

export default Role
