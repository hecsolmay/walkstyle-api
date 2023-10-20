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
  extraPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
    get () {
      return Number(this.getDataValue('extraPrice'))
    }
  },
  size: {
    type: DataTypes.DECIMAL(10, 1),
    allowNull: false,
    get () {
      return Number(this.getDataValue('size'))
    }
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
  timestamps: true,
  paranoid: true
})

export default Size
