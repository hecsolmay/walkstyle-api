import Branch from '@/models/Branch'
import Category from '@/models/Category'
import ProductCategory from '@/models/Products-Category'
import Gender from '@/models/Gender'
import Product from '@/models/Product'
import ProductImage from '@/models/Product-Image'
import Role from '@/models/Role'
import Sale from '@/models/Sale'
import SaleProduct from '@/models/Sale-Product'
import Size from '@/models/Size'
import User from '@/models/User'

// BRANCH

Branch.hasMany(Product, { foreignKey: 'branchId' })

// PRODUCT-CATEGORY

Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' })
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' })

// GENDER

Gender.hasMany(Product, { foreignKey: 'genderId' })

// PRODUCT-IMAGE

ProductImage.belongsTo(Product, { foreignKey: 'productId' })
Product.hasMany(ProductImage, { foreignKey: 'productId' })

// SALE

Sale.belongsTo(User, { foreignKey: 'userId' })

// SIZE

Size.belongsTo(Product, { foreignKey: 'productId' })

// PRODUCT

Product.hasMany(Size, { foreignKey: 'productId' })
Product.belongsTo(Gender, { foreignKey: 'genderId' })

// SALE-PRODUCT

Sale.belongsToMany(Size, { through: SaleProduct, foreignKey: 'saleId' })
Size.belongsToMany(Sale, { through: SaleProduct, foreignKey: 'sizeId' })

// USER

User.hasMany(Sale, { foreignKey: 'userId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

// ROLE

Role.hasMany(User, { foreignKey: 'roleId', as: 'roleUsers' })
