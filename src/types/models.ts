import {
  type BrandAttributes,
  type CategoryAttributes,
  type CategoryProductsAttributes,
  type GenderAttributes,
  type ImageAttributes,
  type ProductAttributes,
  type ProductImageAttributes,
  type RoleAttributes,
  type SaleAttributes,
  type SaleProductAttributes,
  type SizeAttributes,
  type UserAttributes
} from '@/types/attributes'
import { type Model } from 'sequelize'

export interface UserModel extends Model<UserAttributes>, UserAttributes {
  validPassword: (password: string) => Promise<boolean>
}

export interface ProductModel extends Model<ProductAttributes>, ProductAttributes {}
export interface BrandModel extends Model<BrandAttributes>, BrandAttributes {}
export interface SizeModel extends Model<SizeAttributes>, SizeAttributes {}
export interface CategoryModel extends Model<CategoryAttributes>, CategoryAttributes {}
export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}
export interface GenderCategoryModel extends Model<GenderAttributes>, GenderAttributes {}
export interface CategoryProductModel extends Model<CategoryProductsAttributes>, CategoryProductsAttributes {}
export interface ProductImageModel extends Model<ProductImageAttributes>, ProductImageAttributes {}
export interface SaleModel extends Model<SaleAttributes>, SaleAttributes {}
export interface SaleProductModel extends Model<SaleProductAttributes>, SaleProductAttributes {}
export interface ImageModel extends Model<ImageAttributes>, ImageAttributes {}
