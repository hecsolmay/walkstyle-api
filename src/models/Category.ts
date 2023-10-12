import { sequelize } from '@/database'
import Image from '@/models/Image'
import { type CategoryModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const Category: ModelStatic<CategoryModel> = sequelize.define<CategoryModel>('categories', {
  categoryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'category_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  imageId: {
    type: DataTypes.UUID,
    references: {
      model: Image
    }
  },
  bannerId: {
    type: DataTypes.UUID,
    references: {
      model: Image
    }
  }
}, {
  freezeTableName: true,
  modelName: 'Category',
  timestamps: true,
  paranoid: true
})

export default Category
