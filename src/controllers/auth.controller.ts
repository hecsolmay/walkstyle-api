import { Request, Response } from "express";
import { validateRegister, validateLogin } from "../schemas/auth";
import * as services from "../service/user";
require("dotenv").config();
var jwt = require("jsonwebtoken");

export async function login(req: Request, res: Response) {
  try {
    const validationResult = validateLogin(req.body);

    if (!validationResult.success) {
      return res.status(400).json(validationResult.error);
    }

    const newUser = validationResult.data;
    const user = await services.getOne({ email: newUser.email });

    if (user) {
      const isCorrectPassword = await user.validPassword(newUser.password ?? '');

      if (!isCorrectPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Genera un nuevo token de acceso
      const Token = jwt.sign({ userId: user.userId ?? '' }, process.env.SECRET, {
        expiresIn: '5m',
      });

      // Genera un nuevo refresh token
      const refreshToken = jwt.sign(
        { userId: user.userId ?? '' },
        process.env.REFRESHSECRET,
        { expiresIn: '1y' }
      );

      // Actualiza el refresh token en la base de datos
      await user.update({ rememberToken: refreshToken });

      return res.status(200).json({ user, Token });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
}
// export async function login(req: Request, res: Response) {
//   try {
//     const validationResult = validateLogin(req.body);

//     if (!validationResult.success) {
//       return res.status(400).json(validationResult.error);
//     }
//     const newUser = validationResult.data;
//     const existingUser = await services.getOne({ email: newUser.email });
//     if (existingUser) {
//       const isCorrectPassword = await existingUser.validPassword(newUser.password ?? '')
//       if (!isCorrectPassword) {
//         return res.status(404).json({ message: 'Passwords not Matched' })
//       }
      
//     }else{
//       return res.status(404).json({ message: 'User Not Found' })

//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error interno" });

//   }
//   res.send("login");
// }
export async function register(req: Request, res: Response) {
  try {
    const validationResult = validateRegister(req.body);

    if (!validationResult.success) {
      return res.status(400).json(validationResult.error);
    }
    const newUser = validationResult.data;

    // Verificar si el correo electrónico ya existe en la base de datos
    const existingUser = await services.getOne({ email: newUser.email }); // Pasar un objeto con 'email'

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso." });
    }

    const user = await services.create(newUser);

    const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESHSECRET,
      { expiresIn: "1y" }
    );
    await user.update({ rememberToken: refreshToken });
    return res.status(201).json({ message: "Registro exitoso", user });
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return res.status(500).json({ message: "Error interno" });
  }
}
