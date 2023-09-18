import { sequelize } from '@/database'
import { type ProductImageModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Product from './Product'

const ProductImage: ModelStatic<ProductImageModel> = sequelize.define<ProductImageModel>('product_image', {
  productImageId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'product_image_id'
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: Product
    }
  },
  main: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preview: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'ProductImage'
})

export default ProductImage
