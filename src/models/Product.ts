import { sequelize } from '@/database'
import Brand from '@/models/Brand'
import Gender from '@/models/Gender'
import { type ProductModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const Product: ModelStatic<ProductModel> = sequelize.define<ProductModel>(
  'products',
  {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'product_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get () {
        return Number(this.getDataValue('price'))
      }
    },
    genderId: {
      type: DataTypes.UUID,
      references: {
        model: Gender
      }
    },
    brandId: {
      type: DataTypes.UUID,
      references: {
        model: Brand
      }
    }
  },
  {
    freezeTableName: true,
    modelName: 'Product',
    timestamps: true,
    paranoid: true
  }
)

export default Product
