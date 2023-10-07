import { type } from 'os';
import { z } from 'zod'

  

  const LoginDTO = z.object({
    email: z
    .string()
    .email()
    .refine((value) => value.trim() !== "", {
      message: "El campo email no puede ser nulo ni contener espacios en blanco.",
    }),
  password: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "El campo password no puede ser nulo ni contener espacios en blanco.",
    })
    .transform((value) => value.toLowerCase()), // Convertir a minúsculas
  })
  export type LoginDTO = z.infer<typeof LoginDTO>;
//   const RegisterDTO = z.object({
//     name: z.string(),
//     lastname: z.string(), //checar que sea null
//     email: z.string().email().,
//     password: z.string(),
//   })

  const RegisterDTO = z.object({
    name: z.string().nonempty({
        message: "El campo name no puede ser nulo ni estar vacío.",
      }),
      lastname: z.string().nonempty({
        message: "El campo lastname no puede ser nulo ni estar vacío.",
      }),
    email: z
      .string()
      .email()
      .refine((value) => value.trim() !== "", {
        message: "El campo email no puede ser nulo ni contener espacios en blanco.",
      }),
    password: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "El campo password no puede ser nulo ni contener espacios en blanco.",
      })
      .transform((value) => value.toLowerCase()), // Convertir a minúsculas
  });




 export  type RegisterDTO = z.infer<typeof RegisterDTO>;


export function validateLogin (input: any) {
    return LoginDTO.safeParse(input)
    
}
export function validateRegister (input: any) {
    return RegisterDTO.safeParse(input) 
}
