import { sequelize } from '@/database'
import Image from '@/models/Image'
import Product from '@/models/Product'
import { type ProductImageModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

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
  imageId: {
    type: DataTypes.UUID,
    references: {
      model: Image
    }
  }
}, {
  freezeTableName: true,
  modelName: 'ProductImage'
})

export default ProductImage
