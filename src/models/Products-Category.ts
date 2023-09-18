import { sequelize } from '@/database'
import { type CategoryProductModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Category from './Category'
import Product from './Product'

const ProductCategory: ModelStatic<CategoryProductModel> = sequelize.define<CategoryProductModel>('product_category', {
  categoryId: {
    type: DataTypes.UUID,
    references: {
      model: Category
    }
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: Product
    }
  }
}, {
  freezeTableName: true,
  modelName: 'ProductCategory'
})

export default ProductCategory
