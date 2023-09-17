import { type Model } from 'sequelize'
import { type UserAttributes } from './attributes'

export interface UserModel extends Model<UserAttributes>, UserAttributes {
  validPassword: (password: string) => Promise<boolean>
}
