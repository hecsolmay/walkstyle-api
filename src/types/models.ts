import { type Model } from 'sequelize'
import {
  type SizeAttributes,
  type BranchAttributes,
  type ProductAttributes,
  type UserAttributes,
  type CategoryAttributes,
  type RoleAttributes,
  type GenderAttributes,
  type CategoryProductsAttributes,
  type ProductImageAttributes,
  type SaleAttributes,
  type SaleProductAttributes
} from './attributes'

export interface UserModel extends Model<UserAttributes>, UserAttributes {
  validPassword: (password: string) => Promise<boolean>
}

export interface ProductModel extends Model<ProductAttributes>, ProductAttributes {}
export interface BranchModel extends Model<BranchAttributes>, BranchAttributes {}
export interface SizeModel extends Model<SizeAttributes>, SizeAttributes {}
export interface CategoryModel extends Model<CategoryAttributes>, CategoryAttributes {}
export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}
export interface GenderCategoryModel extends Model<GenderAttributes>, GenderAttributes {}
export interface CategoryProductModel extends Model<CategoryProductsAttributes>, CategoryProductsAttributes {}
export interface ProductImageModel extends Model<ProductImageAttributes>, ProductImageAttributes {}
export interface SaleModel extends Model<SaleAttributes>, SaleAttributes {}
export interface SaleProductModel extends Model<SaleProductAttributes>, SaleProductAttributes {}
