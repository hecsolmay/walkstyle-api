import { sequelize } from '@/database'
import User from '@/models/User'
import { type SaleModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

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
    allowNull: true,
    get () {
      return Number(this.getDataValue('totalPaid'))
    }
  }
}, {
  freezeTableName: true,
  modelName: 'Sale',
  timestamps: true,
  paranoid: true
})

export default Sale
