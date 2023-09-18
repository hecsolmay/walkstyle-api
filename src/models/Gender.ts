import { Gender as GenderEnum } from '@/constanst/enums'
import { sequelize } from '@/database'
import { type GenderCategoryModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const enumsGender = Object.values(GenderEnum)

const Gender: ModelStatic<GenderCategoryModel> = sequelize.define<GenderCategoryModel>('gender', {
  genderId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'gender_id'
  },
  name: {
    type: DataTypes.ENUM(...enumsGender),
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'Gender',
  timestamps: true
})

export default Gender
