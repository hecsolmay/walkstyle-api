import { sequelize } from '@/database'
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
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true,
  modelName: 'Category',
  timestamps: true
})

export default Category
