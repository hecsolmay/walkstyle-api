import { sequelize } from '@/database'
import { type UserModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'
import Role from './Role'

const User: ModelStatic<UserModel> = sequelize.define<UserModel>('users', {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'fullname'
  },
  profileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rememberToken: {
    type: DataTypes.STRING,
    defaultValue: null,
    field: 'remember_token'
  },
  roleId: {
    type: DataTypes.UUID,
    references: {
      model: Role
    }
  }
}, {
  freezeTableName: true,
  modelName: 'User',
  paranoid: true,
  hooks: {
    // beforeCreate: async function (user) {
    //   const salt = await bcrypt.genSalt(10)
    //   const saltedPassword = await bcrypt.hash(user.password ?? '', salt)
    //   user.password = saltedPassword
    //   user.fullname = `${user.name} ${user.lastname}`.trim()
    // },
    // beforeUpdate: async function (user) {
    //   user.set('fullname', `${user.name} ${user.lastname}`.trim())
    //   if (user.changed('password')) {
    //     const salt = await bcrypt.genSalt(10)
    //     const saltedPassword = await bcrypt.hash(user.password ?? '', salt)
    //     user.password = saltedPassword
    //   }
    // }
  }
})

// User.prototype.validPassword = async function (password: string): Promise<boolean> {
//   const isValid = await bcrypt.compare(password, this.password)
//   return isValid
// }

export default User
