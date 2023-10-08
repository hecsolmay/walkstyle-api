import { sequelize } from '@/database'
import { type ImageModel } from '@/types/models'
import { DataTypes, type ModelStatic } from 'sequelize'

const Image: ModelStatic<ImageModel> = sequelize.define<ImageModel>('image', {
  imageId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'image_id'
  },
  main: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preview: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'Image'
})

export default Image
