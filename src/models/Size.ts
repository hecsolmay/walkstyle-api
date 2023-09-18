import { sequelize } from '@/database'
import { type SizeModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Product from './Product'

const Size: ModelStatic<SizeModel> = sequelize.define<SizeModel>('sizes', {
  sizeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'size_id'
  },
  extra: {
    type: DataTypes.FLOAT(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  size: {
    type: DataTypes.FLOAT(2, 1),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: Product
    }
  }
}, {
  freezeTableName: true,
  modelName: 'Size',
  timestamps: true
})

export default Size
