import { sequelize } from '@/database'
import { type SaleProductModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Sale from './Sale'
import Size from './Size'

const SaleProduct: ModelStatic<SaleProductModel> = sequelize.define<SaleProductModel>('sale_products', {
  saleProductId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'sale_product_id'
  },
  saleId: {
    type: DataTypes.UUID,
    references: {
      model: Sale
    }
  },
  sizeId: {
    type: DataTypes.UUID,
    references: {
      model: Size
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  extra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'SaleProduct',
  timestamps: true
})

export default SaleProduct
