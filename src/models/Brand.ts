import { sequelize } from '@/database'
import Image from '@/models/Image'
import { type BrandModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const Brand: ModelStatic<BrandModel> = sequelize.define<BrandModel>('brands', {
  brandId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'brand_id'
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
  modelName: 'Brand',
  timestamps: true
})

export default Brand
