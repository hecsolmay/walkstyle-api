import Brand from '@/models/Brand'
import Category from '@/models/Category'
import Gender from '@/models/Gender'
import Image from '@/models/Image'
import Product from '@/models/Product'
import ProductImage from '@/models/Product-Image'
import ProductCategory from '@/models/Products-Category'
import Role from '@/models/Role'
import Sale from '@/models/Sale'
import SaleProduct from '@/models/Sale-Product'
import Size from '@/models/Size'
import User from '@/models/User'

// Brand

Brand.hasMany(Product, { foreignKey: 'brandId' })
Brand.belongsTo(Image, { as: 'banner', foreignKey: 'bannerId' })
Brand.belongsTo(Image, { as: 'image', foreignKey: 'imageId' })

// PRODUCT-CATEGORY

Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' })
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' })
Category.belongsTo(Image, { as: 'banner', foreignKey: 'bannerId' })
Category.belongsTo(Image, { as: 'image', foreignKey: 'imageId' })

// GENDER

Gender.hasMany(Product, { foreignKey: 'genderId' })

// PRODUCT-IMAGE

ProductImage.belongsTo(Product, { foreignKey: 'productId' })
ProductImage.belongsTo(Image, { foreignKey: 'imageId' })
Image.hasMany(ProductImage, { foreignKey: 'imageId' })
Product.hasMany(ProductImage, { foreignKey: 'productId' })

// SALE

Sale.belongsTo(User, { foreignKey: 'userId' })

// SIZE

Size.belongsTo(Product, { foreignKey: 'productId' })

// PRODUCT

Product.hasMany(Size, { foreignKey: 'productId' })
Product.belongsTo(Gender, { foreignKey: 'genderId' })
Product.belongsTo(Brand, { foreignKey: 'brandId' })

// SALE-PRODUCT

Sale.belongsToMany(Size, { through: SaleProduct, foreignKey: 'saleId' })
Size.belongsToMany(Sale, { through: SaleProduct, foreignKey: 'sizeId' })

// USER

User.hasMany(Sale, { foreignKey: 'userId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

// ROLE

Role.hasMany(User, { foreignKey: 'roleId', as: 'roleUsers' })
