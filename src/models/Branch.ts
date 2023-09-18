import { sequelize } from '@/database'
import { type BranchModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const Branch: ModelStatic<BranchModel> = sequelize.define<BranchModel>('branchs', {
  branchId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'branch_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true,
  modelName: 'Branch',
  timestamps: true
})

export default Branch
