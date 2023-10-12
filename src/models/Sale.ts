import { sequelize } from '@/database'
import { type SaleModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import User from './User'

const Sale: ModelStatic<SaleModel> = sequelize.define<SaleModel>('sales', {
  saleId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'sale_id'
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User
    }
  },
  totalPaid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: true
  }
}, {
  freezeTableName: true,
  modelName: 'Sale',
  timestamps: true,
  paranoid: true
})

export default Sale
