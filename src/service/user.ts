import { Role as RoleEnum } from '@/constanst/enums'
import Role from '@/models/Role'
import User from '@/models/User'
import { UserCreateDTO } from '@/types/createDto'


export async function getAll() {
    const users = await User.findOne(    )
    return users
}

export async function create(user: UserCreateDTO) {
    const {role = RoleEnum.USER, ...rest} = user
    const foundRole = await Role.findOne({
            where: {
                name: role
            }
    })
    const newUser = await User.create({...rest, roleId: foundRole?.roleId ?? ""})
    const savedUser = await newUser.save()
    return savedUser
    
}
interface Params {
    email: string; // Declarar una propiedad 'email' en el objeto Params
  }
  
  export async function getOne(params: Params) {
    const { email } = params;
    // Ahora puedes acceder a 'email' dentro del objeto 'params'
    const user = await User.findOne({
      where: {
        email
      }
    });
    return user;
  }

