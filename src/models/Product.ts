import { sequelize } from '@/database'
import { type ProductModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Gender from './Gender'
import Branch from './Branch'

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
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    genderId: {
      type: DataTypes.UUID,
      references: {
        model: Gender
      }
    },
    branchId: {
      type: DataTypes.UUID,
      references: {
        model: Branch
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
